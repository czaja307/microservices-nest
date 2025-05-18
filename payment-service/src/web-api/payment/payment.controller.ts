import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPaymentQuery } from '../../app/handlers/get-payment.handler';
import { GetAllPaymentsQuery } from '../../app/handlers/get-all-payments.handler';
import { Payment } from '../../domain/entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  async getPaymentById(@Param('id') id: string): Promise<Payment> {
    return this.queryBus.execute(new GetPaymentQuery(id));
  }

  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.queryBus.execute(new GetAllPaymentsQuery());
  }
}
