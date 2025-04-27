import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../../domain/commands/create-order.command';
import { Inject, Logger } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderEvent } from '../../domain/events/create-order.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  private readonly logger = new Logger(CreateOrderHandler.name);

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const order = this.orderRepository.create({
      customerName: command.customerName,
      meals: command.meals,
      totalPrice: command.totalPrice,
      paymentStatus: command.paymentStatus,
      orderStatus: command.orderStatus,
    });

    const savedOrder = await this.orderRepository.save(order);

    const event = new CreateOrderEvent(
      savedOrder.id,
      savedOrder.customerName,
      savedOrder.meals,
      savedOrder.totalPrice,
      savedOrder.paymentStatus,
      savedOrder.orderStatus,
    );

    this.eventBus.publish(event);
    this.client.emit(CreateOrderEvent.name, event.toJSON());
    this.logger.log(`Order created with ID: ${savedOrder.id}`);

    return savedOrder;
  }
}