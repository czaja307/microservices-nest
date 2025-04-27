import { Command } from '@nestjs/cqrs';

export class DeletePatientCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
