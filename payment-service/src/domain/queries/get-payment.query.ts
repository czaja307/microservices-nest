import { Query } from '@nestjs/cqrs';
import { Payment } from '../entities/payment.entity';

export class GetPaymentQuery extends Query<Payment> {
  constructor(public readonly id: string) {
    super();
  }
}
