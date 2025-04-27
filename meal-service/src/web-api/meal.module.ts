import { Module } from '@nestjs/common';
import { MealController } from './meal/meal.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [MealController],
  providers: [],
})
export class MealModule {}
