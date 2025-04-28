import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Review } from '../domain/entities/review.entity';
import { ReviewModule } from '../web-api/review.module';
import { CreateReviewHandler } from './handlers/create-review.handler';
import { DeleteReviewHandler } from './handlers/delete-review.handler';
import { GetAllReviewsHandler } from './handlers/get-all-reviews.handler';
import { GetReviewHandler } from './handlers/get-review.handler';

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
      database: process.env.DB_DATABASE || 'review-service',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Don't use synchronize in production
      ssl:
        process.env.DB_SSL === 'true'
          ? {
              rejectUnauthorized: false, // Required for some AWS RDS connections
            }
          : false,
    }),
    TypeOrmModule.forFeature([Review]),
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
    ReviewModule,
  ],
  providers: [
    CreateReviewHandler,
    DeleteReviewHandler,
    GetAllReviewsHandler,
    GetReviewHandler,
  ],
  exports: [],
})
export class AppModule {}
