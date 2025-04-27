import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeletePaymentCommand } from '../../domain/commands/delete-payment.command';
import { Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../domain/entities/payment.entity';
import { Repository } from 'typeorm';
import { DeletePaymentEvent } from '../../domain/events/delete-payment.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DeletePaymentCommand)
export class DeletePaymentHandler
  implements ICommandHandler<DeletePaymentCommand>
{
  private readonly logger = new Logger(DeletePaymentHandler.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeletePaymentCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Attempting to delete payment with ID: ${id}`);

    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      this.logger.warn(`Payment with ID ${id} not found.`);
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    await this.paymentRepository.delete(id);

    const event = new DeletePaymentEvent(id);
    this.eventBus.publish(event);
    this.client.emit(DeletePaymentEvent.name, event.toJSON());
    this.logger.log(`Payment with ID ${id} deleted successfully and event emitted.`);
  }
}