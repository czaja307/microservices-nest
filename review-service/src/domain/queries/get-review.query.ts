import { Query } from '@nestjs/cqrs';
import { Review } from '../entities/review.entity';

export class GetReviewQuery extends Query<Review> {
  constructor(public readonly id: string) {
    super();
  }
}
