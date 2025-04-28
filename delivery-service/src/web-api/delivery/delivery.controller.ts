import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateDeliveryCommand } from '../../domain/commands/create-delivery.command';
import { DeleteDeliveryCommand } from '../../domain/commands/delete-delivery.command';
import { GetDeliveryQuery } from '../../app/handlers/get-delivery.handler';
import { GetAllDeliveriesQuery } from '../../app/handlers/get-all-deliveries.handler';
import { CreateDeliveryDto } from '../../domain/dto/create-delivery.dto';
import { Delivery } from '../../domain/entities/delivery.entity';

@Controller('deliveries')
export class DeliveryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createDelivery(
    @Body() createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    return this.commandBus.execute(
      new CreateDeliveryCommand(
        createDeliveryDto.orderId,
        createDeliveryDto.deliveryAddress,
        createDeliveryDto.recipientPhone,
        createDeliveryDto.recipientName,
        createDeliveryDto.status,
        createDeliveryDto.estimatedDeliveryMinutes,
        createDeliveryDto.notes,
      ),
    );
  }

  @Delete(':id')
  async deleteDelivery(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteDeliveryCommand(id));
  }

  @Get(':id')
  async getDeliveryById(@Param('id') id: string): Promise<Delivery> {
    return this.queryBus.execute(new GetDeliveryQuery(id));
  }

  @Get()
  async getAllDeliveries(
    @Query('orderId') orderId?: string
  ): Promise<Delivery[]> {
    return this.queryBus.execute(new GetAllDeliveriesQuery(orderId));
  }
}