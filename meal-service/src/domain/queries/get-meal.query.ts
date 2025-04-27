import { Query } from '@nestjs/cqrs';
import { Meal } from '../entities/meal.entity';

export class GetMealQuery extends Query<Meal> {
  constructor(public readonly id: string) {
    super();
  }
}
