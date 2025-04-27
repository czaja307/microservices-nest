import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateDeliveryCommand } from '../../domain/commands/update-delivery.command';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { Delivery } from '../../domain/entities/delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDeliveryEvent } from '../../domain/events/update-delivery.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(UpdateDeliveryCommand)
export class UpdateDeliveryHandler
  implements ICommandHandler<UpdateDeliveryCommand>
{
  private readonly logger = new Logger(UpdateDeliveryHandler.name);

  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateDeliveryCommand): Promise<Delivery> {
    const { id, firstName, lastName, email, phone, birthDate, address } =
      command;
    this.logger.log(`Attempting to update delivery with ID: ${id}`);

    const delivery = await this.deliveryRepository.findOne({ where: { id } });
    if (!delivery) {
      this.logger.warn(`Delivery with ID ${id} not found.`);
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    delivery.firstName = firstName;
    delivery.lastName = lastName;
    delivery.email = email;
    delivery.phone = phone;
    delivery.birthDate = birthDate;
    delivery.address = address;

    const updatedDelivery = await this.deliveryRepository.save(delivery);

    const event = new UpdateDeliveryEvent(
      updatedDelivery.id,
      updatedDelivery.firstName,
      updatedDelivery.lastName,
      updatedDelivery.email,
      updatedDelivery.phone,
      updatedDelivery.birthDate,
      updatedDelivery.address,
    );

    this.eventBus.publish(event);
    this.client.emit(UpdateDeliveryEvent.name, event.toJSON());
    this.logger.log(`Delivery with ID ${id} updated successfully and event emitted.`);
    return updatedDelivery;
  }
}