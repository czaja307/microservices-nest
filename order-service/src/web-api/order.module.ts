import { Module } from '@nestjs/common';
import { OrderController } from './order/order.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [OrderController],
  providers: [],
})
export class OrderModule {}
