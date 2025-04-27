import { Command } from '@nestjs/cqrs';
import { Order } from '../entities/order.entity';

export class CreateOrderCommand extends Command<Order> {
  constructor(
    public readonly customerName: string,
    public readonly meals: string[],
    public readonly totalPrice: number,
    public readonly paymentStatus: string,
    public readonly orderStatus: string,
  ) {
    super();
  }
}