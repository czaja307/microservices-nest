import { Module } from '@nestjs/common';
import { PaymentController } from './payment/payment.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [PaymentController],
  providers: [],
})
export class PaymentModule {}
