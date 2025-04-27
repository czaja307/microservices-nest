import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreatePatientCommand } from '../../domain/commands/create-patient.command';
import { Inject, Logger } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePatientEvent } from '../../domain/events/create-patient.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(CreatePatientCommand)
export class CreatePatientHandler implements ICommandHandler<CreatePatientCommand> {
  private readonly logger = new Logger(CreatePatientHandler.name);

  constructor(
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreatePatientCommand): Promise<Patient> {
    const patient = this.patientRepository.create({
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      birthDate: command.birthDate,
      address: command.address,
    });

    const savedPatient = await this.patientRepository.save(patient);

    const event = new CreatePatientEvent(
      savedPatient.id,
      savedPatient.firstName,
      savedPatient.lastName,
      savedPatient.email,
      savedPatient.phone,
      savedPatient.birthDate,
      savedPatient.address,
    );

    this.eventBus.publish(event);
    this.client.emit(CreatePatientEvent.name, event.toJSON());
    this.logger.log(`Patient created with ID: ${savedPatient.id}`);

    return savedPatient;
  }
}