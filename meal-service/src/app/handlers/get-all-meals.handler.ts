import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Meal } from '../../domain/entities/meal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetAllMealsQuery {}

@QueryHandler(GetAllMealsQuery)
export class GetAllMealsHandler
  implements IQueryHandler<GetAllMealsQuery>
{
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async execute(): Promise<Meal[]> {
    return await this.mealRepository.find();
  }
}
