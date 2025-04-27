import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Review } from '../../domain/entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetAllReviewsQuery {}

@QueryHandler(GetAllReviewsQuery)
export class GetAllReviewsHandler
  implements IQueryHandler<GetAllReviewsQuery>
{
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async execute(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }
}
