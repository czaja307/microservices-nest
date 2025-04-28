import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReviewCommand } from '../../domain/commands/create-review.command';
import { DeleteReviewCommand } from '../../domain/commands/delete-review.command';
import { GetReviewQuery } from '../../app/handlers/get-review.handler';
import { GetAllReviewsQuery } from '../../app/handlers/get-all-reviews.handler';
import { CreateReviewDto } from '../../domain/dto/create-review.dto';
import { Review } from '../../domain/entities/review.entity';

@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.commandBus.execute(
      new CreateReviewCommand(
        createReviewDto.deliveryId,
        createReviewDto.rating,
        createReviewDto.comment,
        createReviewDto.customerName,
        createReviewDto.customerEmail,
      ),
    );
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteReviewCommand(id));
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string): Promise<Review> {
    return this.queryBus.execute(new GetReviewQuery(id));
  }

  @Get()
  async getAllReviews(@Query('deliveryId') deliveryId?: string): Promise<Review[]> {
    if (deliveryId) {
      return this.queryBus.execute(new GetReviewQuery(deliveryId));
    }
    return this.queryBus.execute(new GetAllReviewsQuery());
  }
}