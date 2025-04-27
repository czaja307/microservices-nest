import { Command } from '@nestjs/cqrs';

export class DeleteMealCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
