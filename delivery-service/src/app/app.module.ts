import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { Delivery } from '../domain/entities/delivery.entity';
import { DeliveryModule } from '../web-api/delivery.module';
import { CreateDeliveryHandler } from './handlers/create-delivery.handler';
import { DeleteDeliveryHandler } from './handlers/delete-delivery.handler';
import { GetAllDeliveriesHandler } from './handlers/get-all-deliveries.handler';
import { GetDeliveryHandler } from './handlers/get-delivery.handler';
import { EventsController } from './controllers/events.controller';

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
      database: process.env.DB_DATABASE || 'delivery-service',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Don't use synchronize in production
      ssl:
        process.env.DB_SSL === 'true'
          ? {
              rejectUnauthorized: false, // Required for some AWS RDS connections
            }
          : false,
    }),
    TypeOrmModule.forFeature([Delivery]),
    ClientsModule.register([
      {
        name: 'REVIEW_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: "ReviewServiceQueue",
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CqrsModule,
    DeliveryModule,
  ],
  controllers: [EventsController],
  providers: [
    CreateDeliveryHandler,
    DeleteDeliveryHandler,
    GetAllDeliveriesHandler,
    GetDeliveryHandler,
  ],
  exports: [],
})
export class AppModule {}