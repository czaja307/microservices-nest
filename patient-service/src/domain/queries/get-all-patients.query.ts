import { Query } from '@nestjs/cqrs';
import { Patient } from '../entities/patient.entity';

export class GetAllPatientsQuery extends Query<Patient[]> {
  constructor() {
    super();
  }
}
