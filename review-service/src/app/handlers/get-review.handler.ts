import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Review } from '../../domain/entities/review.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class GetReviewQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetReviewQuery)
export class GetReviewHandler implements IQueryHandler<GetReviewQuery> {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async execute(query: GetReviewQuery): Promise<Review> {
    const { id } = query;
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${query.id} not found`);
    }

    return review;
  }
}
