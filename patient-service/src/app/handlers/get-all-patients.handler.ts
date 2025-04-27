import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Patient } from '../../domain/entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetAllPatientsQuery {}

@QueryHandler(GetAllPatientsQuery)
export class GetAllPatientsHandler
  implements IQueryHandler<GetAllPatientsQuery>
{
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async execute(): Promise<Patient[]> {
    return await this.patientRepository.find();
  }
}
