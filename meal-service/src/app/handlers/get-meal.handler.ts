import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Meal } from '../../domain/entities/meal.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetMealQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetMealQuery)
export class GetMealHandler implements IQueryHandler<GetMealQuery> {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async execute(query: GetMealQuery): Promise<Meal> {
    const { id } = query;
    const meal = await this.mealRepository.findOne({
      where: { id },
    });

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${query.id} not found`);
    }

    return meal;
  }
}
