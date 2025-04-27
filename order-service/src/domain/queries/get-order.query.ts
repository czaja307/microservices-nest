import { Query } from '@nestjs/cqrs';
import { Order } from '../entities/order.entity';

export class GetOrderQuery extends Query<Order> {
  constructor(public readonly id: string) {
    super();
  }
}
