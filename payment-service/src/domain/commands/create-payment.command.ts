import { Command } from '@nestjs/cqrs';
import { Payment } from '../entities/payment.entity';

export class CreatePaymentCommand extends Command<Payment> {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly birthDate: Date,
    public readonly address: string,
  ) {
    super();
  }
}
