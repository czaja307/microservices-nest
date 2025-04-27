import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../../domain/commands/create-payment.command';
import { UpdatePaymentCommand } from '../../domain/commands/update-payment.command';
import { DeletePaymentCommand } from '../../domain/commands/delete-payment.command';
import { GetPaymentQuery } from '../../app/handlers/get-payment.handler';
import { GetAllPaymentsQuery } from '../../app/handlers/get-all-payments.handler';
import { CreatePaymentDto } from '../../domain/dto/create-payment.dto';
import { UpdatePaymentDto } from '../../domain/dto/update-payment.dto';
import { Payment } from '../../domain/entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.commandBus.execute(
      new CreatePaymentCommand(
        createPaymentDto.firstName,
        createPaymentDto.lastName,
        createPaymentDto.email,
        createPaymentDto.phone,
        createPaymentDto.birthDate,
        createPaymentDto.address,
      ),
    );
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return this.commandBus.execute(
      new UpdatePaymentCommand(
        id,
        updatePaymentDto.firstName,
        updatePaymentDto.lastName,
        updatePaymentDto.email,
        updatePaymentDto.phone,
        updatePaymentDto.birthDate,
        updatePaymentDto.address,
      ),
    );
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeletePaymentCommand(id));
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string): Promise<Payment> {
    return this.queryBus.execute(new GetPaymentQuery(id));
  }

  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.queryBus.execute(new GetAllPaymentsQuery());
  }
}
