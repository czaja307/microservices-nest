import { Query } from '@nestjs/cqrs';
import { Patient } from '../entities/patient.entity';

export class GetPatientQuery extends Query<Patient> {
  constructor(public readonly id: string) {
    super();
  }
}
