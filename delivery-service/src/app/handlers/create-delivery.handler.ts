import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateDeliveryCommand } from '../../domain/commands/create-delivery.command';
import { Inject, Logger } from '@nestjs/common';
import { Delivery, DeliveryStatus } from '../../domain/entities/delivery.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDeliveryEvent } from '../../domain/events/create-delivery.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(CreateDeliveryCommand)
export class CreateDeliveryHandler implements ICommandHandler<CreateDeliveryCommand> {
  private readonly logger = new Logger(CreateDeliveryHandler.name);

  constructor(
    @InjectRepository(Delivery) private readonly deliveryRepository: Repository<Delivery>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateDeliveryCommand): Promise<Delivery> {
    const delivery = this.deliveryRepository.create({
      orderId: command.orderId,
      deliveryAddress: command.deliveryAddress,
      recipientPhone: command.recipientPhone,
      recipientName: command.recipientName,
      status: command.status || DeliveryStatus.PENDING,
      estimatedDeliveryMinutes: command.estimatedDeliveryMinutes || 30, // Default to 30 minutes
      notes: command.notes,
    });

    const savedDelivery = await this.deliveryRepository.save(delivery);

    const event = new CreateDeliveryEvent(
      savedDelivery.id,
      savedDelivery.orderId,
      savedDelivery.deliveryAddress,
      savedDelivery.recipientPhone,
      savedDelivery.recipientName,
      savedDelivery.status,
      savedDelivery.estimatedDeliveryMinutes,
      savedDelivery.notes,
    );

    this.eventBus.publish(event);
    this.client.emit(CreateDeliveryEvent.name, event.toJSON());
    this.logger.log(`Delivery created with ID: ${savedDelivery.id} for order: ${savedDelivery.orderId}`);

    // Mock delivery process
    this.mockDeliveryProcess(savedDelivery.id);

    return savedDelivery;
  }

  private async mockDeliveryProcess(deliveryId: string): Promise<void> {
    // Simulate assignment after 5 seconds
    setTimeout(async () => {
      const delivery = await this.deliveryRepository.findOne({ where: { id: deliveryId } });
      if (!delivery) return;

      delivery.status = DeliveryStatus.ASSIGNED;
      delivery.deliveryPersonId = `driver-${Math.floor(Math.random() * 1000)}`;
      await this.deliveryRepository.save(delivery);
      this.logger.log(`Delivery ${deliveryId} assigned to ${delivery.deliveryPersonId}`);

      // Emit event for assignment
      this.emitStatusUpdateEvent(delivery);
    }, 5000);

    // Simulate in transit after 10 seconds
    setTimeout(async () => {
      const delivery = await this.deliveryRepository.findOne({ where: { id: deliveryId } });
      if (!delivery) return;

      delivery.status = DeliveryStatus.IN_TRANSIT;
      await this.deliveryRepository.save(delivery);
      this.logger.log(`Delivery ${deliveryId} is now in transit`);

      // Emit event for in transit
      this.emitStatusUpdateEvent(delivery);
    }, 10000);

    // Simulate delivery after estimatedDeliveryMinutes or default to 15 seconds for demonstration
    setTimeout(async () => {
      const delivery = await this.deliveryRepository.findOne({ where: { id: deliveryId } });
      if (!delivery) return;

      delivery.status = DeliveryStatus.DELIVERED;
      await this.deliveryRepository.save(delivery);
      this.logger.log(`Delivery ${deliveryId} has been delivered`);

      // Emit event for delivery completed
      this.emitStatusUpdateEvent(delivery);
    }, 15000);
  }

  private emitStatusUpdateEvent(delivery: Delivery): void {
    const event = new CreateDeliveryEvent(
      delivery.id,
      delivery.orderId,
      delivery.deliveryAddress,
      delivery.recipientPhone,
      delivery.recipientName,
      delivery.status,
      delivery.estimatedDeliveryMinutes,
      delivery.notes,
      delivery.deliveryPersonId
    );

    this.eventBus.publish(event);
    this.client.emit('DeliveryStatusUpdated', event.toJSON());
  }
}