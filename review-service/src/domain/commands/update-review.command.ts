import { Command } from '@nestjs/cqrs';
import { Review } from '../entities/review.entity';

export class UpdateReviewCommand extends Command<Review> {
  constructor(
    public readonly id: string,
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
