import { Command } from '@nestjs/cqrs';

export class DeleteDeliveryCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
