import { Query } from '@nestjs/cqrs';
import { Meal } from '../entities/meal.entity';

export class GetAllMealsQuery extends Query<Meal[]> {
  constructor() {
    super();
  }
}
