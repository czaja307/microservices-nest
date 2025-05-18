// meal-service/src/domain/commands/create-meal.command.ts
import { Command } from '@nestjs/cqrs';
import { Meal } from '../entities/meal.entity';

export class CreateMealCommand extends Command<Meal> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly preparationTimeMinutes: number,
  ) {
    super();
  }
}
