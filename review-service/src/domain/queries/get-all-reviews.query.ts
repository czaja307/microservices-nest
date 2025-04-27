import { Query } from '@nestjs/cqrs';
import { Review } from '../entities/review.entity';

export class GetAllReviewsQuery extends Query<Review[]> {
  constructor() {
    super();
  }
}
