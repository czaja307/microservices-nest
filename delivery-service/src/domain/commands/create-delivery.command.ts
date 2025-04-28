// delivery-service/src/domain/commands/create-delivery.command.ts
import { Command } from '@nestjs/cqrs';
import { Delivery } from '../entities/delivery.entity';

export class CreateDeliveryCommand extends Command<Delivery> {
  constructor(
    public readonly orderId: string,
    public readonly deliveryAddress: string,
    public readonly recipientPhone: string,
    public readonly recipientName: string,
    public readonly status?: string,
    public readonly estimatedDeliveryMinutes?: number,
    public readonly notes?: string,
  ) {
    super();
  }
}