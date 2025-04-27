import { Query } from '@nestjs/cqrs';
import { Payment } from '../entities/payment.entity';

export class GetAllPaymentsQuery extends Query<Payment[]> {
  constructor() {
    super();
  }
}
