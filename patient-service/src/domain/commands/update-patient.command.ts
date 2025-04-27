import { Command } from '@nestjs/cqrs';
import { Patient } from '../entities/patient.entity';

export class UpdatePatientCommand extends Command<Patient> {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly birthDate: Date,
    public readonly address: string,
  ) {
    super();
  }
}
