import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OrderPreparation } from '../../domain/entities/order-preparation.entity';

// Define the queries
export class GetOrderPreparationQuery {
  constructor(public readonly orderId: string) {}
}

export class GetAllOrderPreparationsQuery {}

@Controller('order-preparation')
export class OrderPreparationController {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':orderId')
  async getOrderPreparation(@Param('orderId') orderId: string): Promise<OrderPreparation> {
    return this.queryBus.execute(new GetOrderPreparationQuery(orderId));
  }

  @Get()
  async getAllOrderPreparations(): Promise<OrderPreparation[]> {
    return this.queryBus.execute(new GetAllOrderPreparationsQuery());
  }
}