import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdatePatientCommand } from '../../domain/commands/update-patient.command';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePatientEvent } from '../../domain/events/update-patient.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(UpdatePatientCommand)
export class UpdatePatientHandler
  implements ICommandHandler<UpdatePatientCommand>
{
  private readonly logger = new Logger(UpdatePatientHandler.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdatePatientCommand): Promise<Patient> {
    const { id, firstName, lastName, email, phone, birthDate, address } =
      command;
    this.logger.log(`Attempting to update patient with ID: ${id}`);

    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      this.logger.warn(`Patient with ID ${id} not found.`);
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    patient.firstName = firstName;
    patient.lastName = lastName;
    patient.email = email;
    patient.phone = phone;
    patient.birthDate = birthDate;
    patient.address = address;

    const updatedPatient = await this.patientRepository.save(patient);

    const event = new UpdatePatientEvent(
      updatedPatient.id,
      updatedPatient.firstName,
      updatedPatient.lastName,
      updatedPatient.email,
      updatedPatient.phone,
      updatedPatient.birthDate,
      updatedPatient.address,
    );

    this.eventBus.publish(event);
    this.client.emit(UpdatePatientEvent.name, event.toJSON());
    this.logger.log(`Patient with ID ${id} updated successfully and event emitted.`);
    return updatedPatient;
  }
}