import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Patient } from '../../domain/entities/patient.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetPatientQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetPatientQuery)
export class GetPatientHandler implements IQueryHandler<GetPatientQuery> {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async execute(query: GetPatientQuery): Promise<Patient> {
    const { id } = query;
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${query.id} not found`);
    }

    return patient;
  }
}
