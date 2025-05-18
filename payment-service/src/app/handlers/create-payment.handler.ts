import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../../domain/commands/create-payment.command';
import { Inject, Logger } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentEvent } from '../../domain/events/create-payment.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentCommand>
{
  private readonly logger = new Logger(CreatePaymentHandler.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject('ORDER_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<Payment> {
    const payment = this.paymentRepository.create({
      orderId: command.orderId,
      paymentMethod: command.paymentMethod,
      totalPrice: command.totalPrice,
      paymentStatus: command.paymentStatus,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    const event = new CreatePaymentEvent(
      savedPayment.id,
      savedPayment.orderId,
      savedPayment.paymentMethod,
      savedPayment.totalPrice,
      savedPayment.paymentStatus,
    );

    this.eventBus.publish(event);
    this.client.emit(CreatePaymentEvent.name, event.toJSON());
    this.logger.log(`Payment created with ID: ${savedPayment.id}`);

    return savedPayment;
  }
}
