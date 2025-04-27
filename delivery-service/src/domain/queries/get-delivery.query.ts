import { Query } from '@nestjs/cqrs';
import { Delivery } from '../entities/delivery.entity';

export class GetDeliveryQuery extends Query<Delivery> {
  constructor(public readonly id: string) {
    super();
  }
}
