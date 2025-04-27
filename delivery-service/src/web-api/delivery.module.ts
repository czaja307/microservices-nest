import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery/delivery.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [DeliveryController],
  providers: [],
})
export class DeliveryModule {}
