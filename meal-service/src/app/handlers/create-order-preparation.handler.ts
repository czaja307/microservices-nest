import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateOrderPreparationCommand } from '../../domain/commands/create-order-preparation.command';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderPreparation, PreparationStatus } from '../../domain/entities/order-preparation.entity';
import { OrderPreparationStatusEvent } from '../../domain/events/order-preparation-status.event';
import { Meal } from '../../domain/entities/meal.entity';

@CommandHandler(CreateOrderPreparationCommand)
export class CreateOrderPreparationHandler implements ICommandHandler<CreateOrderPreparationCommand> {
  private readonly logger = new Logger(CreateOrderPreparationHandler.name);

  constructor(
    @InjectRepository(OrderPreparation) private readonly orderPreparationRepository: Repository<OrderPreparation>,
    @InjectRepository(Meal) private readonly mealRepository: Repository<Meal>,
    @Inject('DELIVERY_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderPreparationCommand): Promise<OrderPreparation> {
    const { orderId, mealIds } = command;

    // Calculate estimated preparation time based on meals
    const meals = await this.mealRepository.find({ where: { id: In(mealIds) } });
    const maxPrepTime = Math.max(...meals.map(meal => meal.preparationTimeMinutes), 0);

    const orderPreparation = this.orderPreparationRepository.create({
      orderId,
      mealIds,
      status: PreparationStatus.RECEIVED,
      estimatedCompletionMinutes: maxPrepTime,
    });

    const savedOrderPreparation = await this.orderPreparationRepository.save(orderPreparation);

    const event = new OrderPreparationStatusEvent(
      savedOrderPreparation.orderId,
      savedOrderPreparation.status,
      savedOrderPreparation.estimatedCompletionMinutes,
    );

    this.eventBus.publish(event);

    // Using the event name directly as the pattern
    this.client.emit('OrderPreparationStatusEvent', event.toJSON());

    this.logger.log(`Order preparation started for order ID: ${savedOrderPreparation.orderId}`);

    // Simulate kitchen preparation process
    setTimeout(() => {
      this.updateOrderStatus(orderId, PreparationStatus.IN_PROGRESS);
      setTimeout(() => {
      this.updateOrderStatus(orderId, PreparationStatus.READY);
      }, maxPrepTime * 100); // Mark as ready after estimated preparation time (scaled down for demo)
    }, 1000); // Start preparation after 1 second


    return savedOrderPreparation;
  }

  private async updateOrderStatus(orderId: string, status: PreparationStatus): Promise<void> {
    const orderPreparation = await this.orderPreparationRepository.findOne({ where: { orderId } });
    if (!orderPreparation) return;

    orderPreparation.status = status;
    await this.orderPreparationRepository.save(orderPreparation);

    const event = new OrderPreparationStatusEvent(
      orderPreparation.orderId,
      orderPreparation.status,
      orderPreparation.estimatedCompletionMinutes,
    );

    this.eventBus.publish(event);

    // Use 'OrderPreparationStatusEvent' as the event name
    this.client.emit('OrderPreparationStatusEvent', event.toJSON());

    this.logger.log(`Order ${orderId} status updated to: ${status}`);
  }
}