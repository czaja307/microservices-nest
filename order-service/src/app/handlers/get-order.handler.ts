import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Order } from '../../domain/entities/order.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetOrderQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async execute(query: GetOrderQuery): Promise<Order> {
    const { id } = query;
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${query.id} not found`);
    }

    return order;
  }
}
