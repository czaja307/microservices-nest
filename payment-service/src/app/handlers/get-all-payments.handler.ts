import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Payment } from '../../domain/entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetAllPaymentsQuery {}

@QueryHandler(GetAllPaymentsQuery)
export class GetAllPaymentsHandler
  implements IQueryHandler<GetAllPaymentsQuery>
{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async execute(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }
}
