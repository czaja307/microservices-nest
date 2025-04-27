import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../../domain/commands/create-payment.command';
import { Inject, Logger } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentEvent } from '../../domain/events/create-payment.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  private readonly logger = new Logger(CreatePaymentHandler.name);

  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<Payment> {
    const payment = this.paymentRepository.create({
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      birthDate: command.birthDate,
      address: command.address,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    const event = new CreatePaymentEvent(
      savedPayment.id,
      savedPayment.firstName,
      savedPayment.lastName,
      savedPayment.email,
      savedPayment.phone,
      savedPayment.birthDate,
      savedPayment.address,
    );

    this.eventBus.publish(event);
    this.client.emit(CreatePaymentEvent.name, event.toJSON());
    this.logger.log(`Payment created with ID: ${savedPayment.id}`);

    return savedPayment;
  }
}