import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Delivery } from '../../domain/entities/delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetAllDeliveriesQuery {}

@QueryHandler(GetAllDeliveriesQuery)
export class GetAllDeliveriesHandler
  implements IQueryHandler<GetAllDeliveriesQuery>
{
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  async execute(): Promise<Delivery[]> {
    return await this.deliveryRepository.find();
  }
}
