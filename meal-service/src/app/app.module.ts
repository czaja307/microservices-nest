import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Meal } from '../domain/entities/meal.entity';
import { MealModule } from '../web-api/meal.module';
import { CreateMealHandler } from './handlers/create-meal.handler';
import { DeleteMealHandler } from './handlers/delete-meal.handler';
import { GetAllMealsHandler } from './handlers/get-all-meals.handler';
import { GetMealHandler } from './handlers/get-meal.handler';
import { UpdateMealHandler } from './handlers/update-meal.handler';

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
    TypeOrmModule.forFeature([Meal]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: process.env.RABBITMQ_QUEUE || 'default_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    CqrsModule,
    MealModule,
  ],
  providers: [
    CreateMealHandler,
    DeleteMealHandler,
    GetAllMealsHandler,
    GetMealHandler,
    UpdateMealHandler,
  ],
  exports: [],
})
export class AppModule {}
