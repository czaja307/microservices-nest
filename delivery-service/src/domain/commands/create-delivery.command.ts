import { Command } from '@nestjs/cqrs';
import { Delivery } from '../entities/delivery.entity';

export class CreateDeliveryCommand extends Command<Delivery> {
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
