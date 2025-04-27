import { Command } from '@nestjs/cqrs';
import { Review } from '../entities/review.entity';

export class CreateReviewCommand extends Command<Review> {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly birthDate: Date,
    public readonly address: string,
  ) {
    super();
  }
}
