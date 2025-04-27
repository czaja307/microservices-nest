import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
// import { PatientRepository } from './repositories/patient.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Patient } from '../domain/entities/patient.entity';
import { PatientModule } from '../web-api/patient.module';
import { CreatePatientHandler } from './handlers/create-patient.handler';
import { DeletePatientHandler } from './handlers/delete-patient.handler';
import { GetAllPatientsHandler } from './handlers/get-all-patients.handler';
import { GetPatientHandler } from './handlers/get-patient.handler';
import { UpdatePatientHandler } from './handlers/update-patient.handler';

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
      database: process.env.DB_DATABASE || 'patient-service',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Don't use synchronize in production
      ssl:
        process.env.DB_SSL === 'true'
          ? {
              rejectUnauthorized: false, // Required for some AWS RDS connections
            }
          : false,
    }),
    TypeOrmModule.forFeature([Patient]),
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
    PatientModule,
  ],
  providers: [
    CreatePatientHandler,
    DeletePatientHandler,
    GetAllPatientsHandler,
    GetPatientHandler,
    UpdatePatientHandler,
  ],
  exports: [],
})
export class AppModule {}
