import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateDeliveryCommand } from '../../domain/commands/create-delivery.command';
import { Inject, Logger } from '@nestjs/common';
import { Delivery } from '../../domain/entities/delivery.entity';
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
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      birthDate: command.birthDate,
      address: command.address,
    });

    const savedDelivery = await this.deliveryRepository.save(delivery);

    const event = new CreateDeliveryEvent(
      savedDelivery.id,
      savedDelivery.firstName,
      savedDelivery.lastName,
      savedDelivery.email,
      savedDelivery.phone,
      savedDelivery.birthDate,
      savedDelivery.address,
    );

    this.eventBus.publish(event);
    this.client.emit(CreateDeliveryEvent.name, event.toJSON());
    this.logger.log(`Delivery created with ID: ${savedDelivery.id}`);

    return savedDelivery;
  }
}