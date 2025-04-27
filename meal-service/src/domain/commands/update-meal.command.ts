import { Command } from '@nestjs/cqrs';
import { Meal } from '../entities/meal.entity';

export class UpdateMealCommand extends Command<Meal> {
  constructor(
    public readonly id: string,
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
