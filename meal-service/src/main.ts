// meal-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'node:process';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CreateOrderEvent } from './domain/events/create-order.event';
import { CreatePaymentEvent } from './domain/events/create-payment.event';

async function bootstrap() {
  // Create a hybrid application that supports both HTTP and microservices
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      transform: true, // Transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

  // Connect to the Order event queue
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: CreateOrderEvent.name,
      queueOptions: {
        durable: true,
      },
    },
  });

  // Connect to the Payment event queue
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: CreatePaymentEvent.name,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3001); // Using 3001 to avoid conflict with other services

  console.log(
    `Meal service is running on: http://localhost:${process.env.PORT || 3001}/meals`,
  );
}
void bootstrap();