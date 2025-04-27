import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePatientCommand } from '../../domain/commands/create-patient.command';
import { UpdatePatientCommand } from '../../domain/commands/update-patient.command';
import { DeletePatientCommand } from '../../domain/commands/delete-patient.command';
import { GetPatientQuery } from '../../app/handlers/get-patient.handler';
import { GetAllPatientsQuery } from '../../app/handlers/get-all-patients.handler';
import { CreatePatientDto } from '../../domain/dto/create-patient.dto';
import { UpdatePatientDto } from '../../domain/dto/update-patient.dto';
import { Patient } from '../../domain/entities/patient.entity';

@Controller('patients')
export class PatientController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createPatient(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return this.commandBus.execute(
      new CreatePatientCommand(
        createPatientDto.firstName,
        createPatientDto.lastName,
        createPatientDto.email,
        createPatientDto.phone,
        createPatientDto.birthDate,
        createPatientDto.address,
      ),
    );
  }

  @Put(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.commandBus.execute(
      new UpdatePatientCommand(
        id,
        updatePatientDto.firstName,
        updatePatientDto.lastName,
        updatePatientDto.email,
        updatePatientDto.phone,
        updatePatientDto.birthDate,
        updatePatientDto.address,
      ),
    );
  }

  @Delete(':id')
  async deletePatient(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeletePatientCommand(id));
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string): Promise<Patient> {
    return this.queryBus.execute(new GetPatientQuery(id));
  }

  @Get()
  async getAllPatients(): Promise<Patient[]> {
    return this.queryBus.execute(new GetAllPatientsQuery());
  }
}
