import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteOrderCommand } from '../../domain/commands/delete-order.command';
import { Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../domain/entities/order.entity';
import { Repository } from 'typeorm';
import { DeleteOrderEvent } from '../../domain/events/delete-order.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler
  implements ICommandHandler<DeleteOrderCommand>
{
  private readonly logger = new Logger(DeleteOrderHandler.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject('MEAL_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Attempting to delete order with ID: ${id}`);

    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      this.logger.warn(`Order with ID ${id} not found.`);
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.orderRepository.delete(id);

    const event = new DeleteOrderEvent(id);
    this.eventBus.publish(event);
    this.client.emit(DeleteOrderEvent.name, event.toJSON());
    this.logger.log(`Order with ID ${id} deleted successfully and event emitted.`);
  }
}