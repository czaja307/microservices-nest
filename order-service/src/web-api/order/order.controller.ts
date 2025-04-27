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
import { CreateOrderCommand } from '../../domain/commands/create-order.command';
import { UpdateOrderCommand } from '../../domain/commands/update-order.command';
import { DeleteOrderCommand } from '../../domain/commands/delete-order.command';
import { GetOrderQuery } from '../../app/handlers/get-order.handler';
import { GetAllOrdersQuery } from '../../app/handlers/get-all-orders.handler';
import { CreateOrderDto } from '../../domain/dto/create-order.dto';
import { UpdateOrderDto } from '../../domain/dto/update-order.dto';
import { Order } from '../../domain/entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.commandBus.execute(
      new CreateOrderCommand(
        createOrderDto.firstName,
        createOrderDto.lastName,
        createOrderDto.email,
        createOrderDto.phone,
        createOrderDto.birthDate,
        createOrderDto.address,
      ),
    );
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.commandBus.execute(
      new UpdateOrderCommand(
        id,
        updateOrderDto.firstName,
        updateOrderDto.lastName,
        updateOrderDto.email,
        updateOrderDto.phone,
        updateOrderDto.birthDate,
        updateOrderDto.address,
      ),
    );
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteOrderCommand(id));
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.queryBus.execute(new GetOrderQuery(id));
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.queryBus.execute(new GetAllOrdersQuery());
  }
}
