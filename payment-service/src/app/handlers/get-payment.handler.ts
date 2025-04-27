import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Payment } from '../../domain/entities/payment.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetPaymentQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async execute(query: GetPaymentQuery): Promise<Payment> {
    const { id } = query;
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${query.id} not found`);
    }

    return payment;
  }
}
