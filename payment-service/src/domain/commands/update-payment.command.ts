import { Command } from '@nestjs/cqrs';
import { Payment } from '../entities/payment.entity';

export class UpdatePaymentCommand extends Command<Payment> {
  constructor(
    public readonly id: string,
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
