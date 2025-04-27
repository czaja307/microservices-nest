import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteMealCommand } from '../../domain/commands/delete-meal.command';
import { Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from '../../domain/entities/meal.entity';
import { Repository } from 'typeorm';
import { DeleteMealEvent } from '../../domain/events/delete-meal.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DeleteMealCommand)
export class DeleteMealHandler
  implements ICommandHandler<DeleteMealCommand>
{
  private readonly logger = new Logger(DeleteMealHandler.name);

  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteMealCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Attempting to delete meal with ID: ${id}`);

    const meal = await this.mealRepository.findOne({ where: { id } });
    if (!meal) {
      this.logger.warn(`Meal with ID ${id} not found.`);
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    await this.mealRepository.delete(id);

    const event = new DeleteMealEvent(id);
    this.eventBus.publish(event);
    this.client.emit(DeleteMealEvent.name, event.toJSON());
    this.logger.log(`Meal with ID ${id} deleted successfully and event emitted.`);
  }
}