import { Module } from '@nestjs/common';
import { PatientController } from './patient/patient.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [PatientController],
  providers: [],
})
export class PatientModule {}
