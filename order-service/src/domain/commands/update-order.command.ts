import { Command } from '@nestjs/cqrs';
import { Order } from '../entities/order.entity';

export class UpdateOrderCommand extends Command<Order> {
  constructor(
    public readonly id: string,
    public readonly customerName: string,
    public readonly meals: string[],
    public readonly totalPrice: number,
  ) {
    super();
  }
}
