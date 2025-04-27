import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeletePatientCommand } from '../../domain/commands/delete-patient.command';
import { Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../../domain/entities/patient.entity';
import { Repository } from 'typeorm';
import { DeletePatientEvent } from '../../domain/events/delete-patient.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DeletePatientCommand)
export class DeletePatientHandler
  implements ICommandHandler<DeletePatientCommand>
{
  private readonly logger = new Logger(DeletePatientHandler.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeletePatientCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Attempting to delete patient with ID: ${id}`);

    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      this.logger.warn(`Patient with ID ${id} not found.`);
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    await this.patientRepository.delete(id);

    const event = new DeletePatientEvent(id);
    this.eventBus.publish(event);
    this.client.emit(DeletePatientEvent.name, event.toJSON());
    this.logger.log(`Patient with ID ${id} deleted successfully and event emitted.`);
  }
}