import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'node:process';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create a hybrid application that supports both HTTP and microservices
  const app = await NestFactory.create(AppModule);
  const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';


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

  app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.RMQ,
  options: {
    urls: [rabbitMQUrl],
    queue: "OrderServiceQueue",
    queueOptions: {
      durable: true,
    },
  },
});

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);

console.log(
  `Application is running on: http://localhost:${process.env.PORT || 3000}/orders`,
);
}
void bootstrap();
