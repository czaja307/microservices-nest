import { Command } from '@nestjs/cqrs';
import { OrderPreparation } from '../entities/order-preparation.entity';

export class CreateOrderPreparationCommand extends Command<OrderPreparation> {
  constructor(
    public readonly orderId: string,
    public readonly mealIds: string[],
  ) {
    super();
  }
}