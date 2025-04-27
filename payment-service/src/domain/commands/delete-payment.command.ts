import { Command } from '@nestjs/cqrs';

export class DeletePaymentCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
