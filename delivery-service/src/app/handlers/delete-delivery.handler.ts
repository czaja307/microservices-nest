import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteDeliveryCommand } from '../../domain/commands/delete-delivery.command';
import { Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from '../../domain/entities/delivery.entity';
import { Repository } from 'typeorm';
import { DeleteDeliveryEvent } from '../../domain/events/delete-delivery.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DeleteDeliveryCommand)
export class DeleteDeliveryHandler
  implements ICommandHandler<DeleteDeliveryCommand>
{
  private readonly logger = new Logger(DeleteDeliveryHandler.name);

  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteDeliveryCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Attempting to delete delivery with ID: ${id}`);

    const delivery = await this.deliveryRepository.findOne({ where: { id } });
    if (!delivery) {
      this.logger.warn(`Delivery with ID ${id} not found.`);
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    await this.deliveryRepository.delete(id);

    const event = new DeleteDeliveryEvent(id);
    this.eventBus.publish(event);
    this.client.emit(DeleteDeliveryEvent.name, event.toJSON());
    this.logger.log(`Delivery with ID ${id} deleted successfully and event emitted.`);
  }
}