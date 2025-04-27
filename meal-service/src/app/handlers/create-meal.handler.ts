import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateMealCommand } from '../../domain/commands/create-meal.command';
import { Inject, Logger } from '@nestjs/common';
import { Meal } from '../../domain/entities/meal.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMealEvent } from '../../domain/events/create-meal.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(CreateMealCommand)
export class CreateMealHandler implements ICommandHandler<CreateMealCommand> {
  private readonly logger = new Logger(CreateMealHandler.name);

  constructor(
    @InjectRepository(Meal) private readonly mealRepository: Repository<Meal>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateMealCommand): Promise<Meal> {
    const meal = this.mealRepository.create({
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      birthDate: command.birthDate,
      address: command.address,
    });

    const savedMeal = await this.mealRepository.save(meal);

    const event = new CreateMealEvent(
      savedMeal.id,
      savedMeal.firstName,
      savedMeal.lastName,
      savedMeal.email,
      savedMeal.phone,
      savedMeal.birthDate,
      savedMeal.address,
    );

    this.eventBus.publish(event);
    this.client.emit(CreateMealEvent.name, event.toJSON());
    this.logger.log(`Meal created with ID: ${savedMeal.id}`);

    return savedMeal;
  }
}