import { Query } from '@nestjs/cqrs';
import { Order } from '../entities/order.entity';

export class GetAllOrdersQuery extends Query<Order[]> {
  constructor() {
    super();
  }
}
