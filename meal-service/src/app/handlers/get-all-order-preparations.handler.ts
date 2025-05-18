// meal-service/src/app/handlers/get-all-order-preparations.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderPreparation } from '../../domain/entities/order-preparation.entity';
import { GetAllOrderPreparationsQuery } from '../../web-api/meal/order-preparation.controller';

@QueryHandler(GetAllOrderPreparationsQuery)
export class GetAllOrderPreparationsHandler
  implements IQueryHandler<GetAllOrderPreparationsQuery>
{
  constructor(
    @InjectRepository(OrderPreparation)
    private readonly orderPreparationRepository: Repository<OrderPreparation>,
  ) {}

  async execute(): Promise<OrderPreparation[]> {
    return await this.orderPreparationRepository.find();
  }
}
