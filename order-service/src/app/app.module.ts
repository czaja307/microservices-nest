import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Order } from '../domain/entities/order.entity';
import { OrderModule } from '../web-api/order.module';
import { CreateOrderHandler } from './handlers/create-order.handler';
import { DeleteOrderHandler } from './handlers/delete-order.handler';
import { GetAllOrdersHandler } from './handlers/get-all-orders.handler';
import { GetOrderHandler } from './handlers/get-order.handler';
import { UpdateOrderHandler } from './handlers/update-order.handler';

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
      database: process.env.DB_DATABASE || 'order-service',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Don't use synchronize in production
      ssl:
        process.env.DB_SSL === 'true'
          ? {
              rejectUnauthorized: false, // Required for some AWS RDS connections
            }
          : false,
    }),
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'PaymentServiceQueue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'MEAL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'MealServiceQueue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    CqrsModule,
    OrderModule,
  ],
  providers: [
    CreateOrderHandler,
    DeleteOrderHandler,
    GetAllOrdersHandler,
    GetOrderHandler,
    UpdateOrderHandler,
  ],
  controllers: [],
  exports: [],
})
export class AppModule {}
