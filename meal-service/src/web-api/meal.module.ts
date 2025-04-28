import { Module } from '@nestjs/common';
import { MealController } from './meal/meal.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderPreparationController } from './meal/order-preparation.controller';

@Module({
  imports: [CqrsModule],
  controllers: [MealController, OrderPreparationController],
  providers: [],
})
export class MealModule {}
