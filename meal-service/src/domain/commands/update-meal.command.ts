import { Command } from '@nestjs/cqrs';
import { Meal } from '../entities/meal.entity';

export class UpdateMealCommand extends Command<Meal> {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly price?: number,
    public readonly preparationTimeMinutes?: number,
  ) {
    super();
  }
}