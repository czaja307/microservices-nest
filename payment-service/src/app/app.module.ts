import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Payment } from '../domain/entities/payment.entity';
import { PaymentModule } from '../web-api/payment.module';
import { CreatePaymentHandler } from './handlers/create-payment.handler';
import { GetAllPaymentsHandler } from './handlers/get-all-payments.handler';
import { GetPaymentHandler } from './handlers/get-payment.handler';
import { EventsController } from './controllers/events.controller';
import { CreatePaymentEvent } from '../domain/events/create-payment.event';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'payment-service',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Don't use synchronize in production
      ssl:
        process.env.DB_SSL === 'true'
          ? {
              rejectUnauthorized: false, // Required for some AWS RDS connections
            }
          : false,
    }),
    TypeOrmModule.forFeature([Payment]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: CreatePaymentEvent.name,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    CqrsModule,
    PaymentModule,
  ],
  providers: [
    CreatePaymentHandler,
    GetAllPaymentsHandler,
    GetPaymentHandler,
    EventsController,
  ],
  controllers: [EventsController],
  exports: [],
})
export class AppModule {}
