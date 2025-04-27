import { Command } from '@nestjs/cqrs';

export class DeleteReviewCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
