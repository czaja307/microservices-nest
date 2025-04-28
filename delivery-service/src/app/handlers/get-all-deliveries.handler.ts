import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Delivery } from '../../domain/entities/delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetAllDeliveriesQuery {
  constructor(public readonly orderId?: string) {}
}

@QueryHandler(GetAllDeliveriesQuery)
export class GetAllDeliveriesHandler
  implements IQueryHandler<GetAllDeliveriesQuery>
{
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  async execute(query: GetAllDeliveriesQuery): Promise<Delivery[]> {
    if (query.orderId) {
      return await this.deliveryRepository.find({
        where: { orderId: query.orderId },
      });
    }
    return await this.deliveryRepository.find();
  }
}