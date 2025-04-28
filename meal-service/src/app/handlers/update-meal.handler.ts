import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateMealCommand } from '../../domain/commands/update-meal.command';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { Meal } from '../../domain/entities/meal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMealEvent } from '../../domain/events/update-meal.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(UpdateMealCommand)
export class UpdateMealHandler
  implements ICommandHandler<UpdateMealCommand>
{
  private readonly logger = new Logger(UpdateMealHandler.name);

  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @Inject('DELIVERY_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateMealCommand): Promise<Meal> {
    const { id, name, description, price, preparationTimeMinutes } =
      command;
    this.logger.log(`Attempting to update meal with ID: ${id}`);

    const meal = await this.mealRepository.findOne({ where: { id } });
    if (!meal) {
      this.logger.warn(`Meal with ID ${id} not found.`);
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    if (name !== undefined) meal.name = name;
    if (description !== undefined) meal.description = description;
    if (price !== undefined) meal.price = price;
    if (preparationTimeMinutes !== undefined)
      meal.preparationTimeMinutes = preparationTimeMinutes;

    const updatedMeal = await this.mealRepository.save(meal);

    const event = new UpdateMealEvent(
      updatedMeal.id,
      updatedMeal.name,
      updatedMeal.description,
      updatedMeal.price,
      updatedMeal.preparationTimeMinutes,
    );

    this.eventBus.publish(event);
    this.client.emit(UpdateMealEvent.name, event.toJSON());
    this.logger.log(`Meal with ID ${id} updated successfully and event emitted.`);
    return updatedMeal;
  }
}