import { Command } from '@nestjs/cqrs';
import { Meal } from '../entities/meal.entity';

export class CreateMealCommand extends Command<Meal> {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly birthDate: Date,
    public readonly address: string,
  ) {
    super();
  }
}
