import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Delivery } from '../../domain/entities/delivery.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetDeliveryQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetDeliveryQuery)
export class GetDeliveryHandler implements IQueryHandler<GetDeliveryQuery> {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  async execute(query: GetDeliveryQuery): Promise<Delivery> {
    const { id } = query;
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${query.id} not found`);
    }

    return delivery;
  }
}
