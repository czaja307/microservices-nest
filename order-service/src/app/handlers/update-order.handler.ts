import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateOrderCommand } from '../../domain/commands/update-order.command';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateOrderEvent } from '../../domain/events/update-order.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler
  implements ICommandHandler<UpdateOrderCommand>
{
  private readonly logger = new Logger(UpdateOrderHandler.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject('MEAL_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateOrderCommand): Promise<Order> {
    const { id, customerName, meals, totalPrice} = command
    this.logger.log(`Attempting to update order with ID: ${id}`);

    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      this.logger.warn(`Order with ID ${id} not found.`);
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.customerName = customerName;
    order.meals = meals;
    order.totalPrice = totalPrice;

    const updatedOrder = await this.orderRepository.save(order);

    const event = new UpdateOrderEvent(
      updatedOrder.id,
      updatedOrder.customerName,
      updatedOrder.meals,
      updatedOrder.totalPrice,
    );

    this.eventBus.publish(event);
    this.client.emit(UpdateOrderEvent.name, event.toJSON());
    this.logger.log(`Order with ID ${id} updated successfully and event emitted.`);
    return updatedOrder;
  }
}