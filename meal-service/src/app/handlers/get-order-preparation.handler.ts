import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderPreparation } from '../../domain/entities/order-preparation.entity';
import { GetOrderPreparationQuery } from '../../web-api/meal/order-preparation.controller';

@QueryHandler(GetOrderPreparationQuery)
export class GetOrderPreparationHandler implements IQueryHandler<GetOrderPreparationQuery> {
  constructor(
    @InjectRepository(OrderPreparation)
    private readonly orderPreparationRepository: Repository<OrderPreparation>,
  ) {}

  async execute(query: GetOrderPreparationQuery): Promise<OrderPreparation> {
    const { orderId } = query;
    const orderPreparation = await this.orderPreparationRepository.findOne({
      where: { orderId },
    });

    if (!orderPreparation) {
      throw new NotFoundException(`Order preparation with ID ${orderId} not found`);
    }

    return orderPreparation;
  }
}