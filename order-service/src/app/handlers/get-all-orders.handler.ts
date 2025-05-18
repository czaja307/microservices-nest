import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Order } from '../../domain/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetAllOrdersQuery {}

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async execute(): Promise<Order[]> {
    return await this.orderRepository.find();
  }
}
