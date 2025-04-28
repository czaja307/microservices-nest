import { Command } from '@nestjs/cqrs';
import { Payment } from '../entities/payment.entity';

export class CreatePaymentCommand extends Command<Payment> {
  constructor(
    public readonly orderId: string,
    public readonly paymentMethod: string,
    public readonly totalPrice: number,
    public readonly paymentStatus: string,
  ) {
    super();
  }
}