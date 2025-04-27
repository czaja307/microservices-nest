import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdatePaymentCommand } from '../../domain/commands/update-payment.command';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePaymentEvent } from '../../domain/events/update-payment.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(UpdatePaymentCommand)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentCommand>
{
  private readonly logger = new Logger(UpdatePaymentHandler.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdatePaymentCommand): Promise<Payment> {
    const { id, firstName, lastName, email, phone, birthDate, address } =
      command;
    this.logger.log(`Attempting to update payment with ID: ${id}`);

    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      this.logger.warn(`Payment with ID ${id} not found.`);
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    payment.firstName = firstName;
    payment.lastName = lastName;
    payment.email = email;
    payment.phone = phone;
    payment.birthDate = birthDate;
    payment.address = address;

    const updatedPayment = await this.paymentRepository.save(payment);

    const event = new UpdatePaymentEvent(
      updatedPayment.id,
      updatedPayment.firstName,
      updatedPayment.lastName,
      updatedPayment.email,
      updatedPayment.phone,
      updatedPayment.birthDate,
      updatedPayment.address,
    );

    this.eventBus.publish(event);
    this.client.emit(UpdatePaymentEvent.name, event.toJSON());
    this.logger.log(`Payment with ID ${id} updated successfully and event emitted.`);
    return updatedPayment;
  }
}