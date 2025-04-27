import { Query } from '@nestjs/cqrs';
import { Delivery } from '../entities/delivery.entity';

export class GetAllDeliveriesQuery extends Query<Delivery[]> {
  constructor() {
    super();
  }
}
