import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMealCommand } from '../../domain/commands/create-meal.command';
import { UpdateMealCommand } from '../../domain/commands/update-meal.command';
import { DeleteMealCommand } from '../../domain/commands/delete-meal.command';
import { GetMealQuery } from '../../app/handlers/get-meal.handler';
import { GetAllMealsQuery } from '../../app/handlers/get-all-meals.handler';
import { CreateMealDto } from '../../domain/dto/create-meal.dto';
import { UpdateMealDto } from '../../domain/dto/update-meal.dto';
import { Meal } from '../../domain/entities/meal.entity';

@Controller('meals')
export class MealController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createMeal(@Body() createMealDto: CreateMealDto): Promise<Meal> {
    return this.commandBus.execute(
      new CreateMealCommand(
        createMealDto.name,
        createMealDto.description,
        createMealDto.price,
        createMealDto.preparationTimeMinutes,
      ),
    );
  }

  @Put(':id')
  async updateMeal(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDto,
  ): Promise<Meal> {
    return this.commandBus.execute(
      new UpdateMealCommand(
        id,
        updateMealDto.name,
        updateMealDto.description,
        updateMealDto.price,
        updateMealDto.preparationTimeMinutes,
      ),
    );
  }

  @Delete(':id')
  async deleteMeal(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteMealCommand(id));
  }

  @Get(':id')
  async getMealById(@Param('id') id: string): Promise<Meal> {
    return this.queryBus.execute(new GetMealQuery(id));
  }

  @Get()
  async getAllMeals(): Promise<Meal[]> {
    return this.queryBus.execute(new GetAllMealsQuery());
  }
}
