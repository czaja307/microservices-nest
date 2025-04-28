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
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
    @Inject('MEAL_SERVICE') private readonly client2: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(CreateOrderHandler.name);

  async execute(command: CreateOrderCommand): Promise<Order> {
    const order = this.orderRepository.create({
      customerName: command.customerName,
      meals: command.meals,
      totalPrice: command.totalPrice,
    });

    const savedOrder = await this.orderRepository.save(order);

    const event = new CreateOrderEvent(
      savedOrder.id,
      savedOrder.customerName,
      savedOrder.meals,
      savedOrder.totalPrice,
    );


    this.client.emit(CreateOrderEvent.name, event.toJSON());
    this.client2.emit(CreateOrderEvent.name, event.toJSON());
    this.logger.log(`Order created with ID: ${savedOrder.id}`);

    return savedOrder;
  }
}