import { Command } from '@nestjs/cqrs';
import { Review } from '../entities/review.entity';

export class CreateReviewCommand extends Command<Review> {
  constructor(
    public readonly deliveryId: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly customerName: string,
    public readonly customerEmail?: string,
  ) {
    super();
  }
}
