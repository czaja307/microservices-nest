import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReviewCommand } from '../../domain/commands/create-review.command';
import { UpdateReviewCommand } from '../../domain/commands/update-review.command';
import { DeleteReviewCommand } from '../../domain/commands/delete-review.command';
import { GetReviewQuery } from '../../app/handlers/get-review.handler';
import { GetAllReviewsQuery } from '../../app/handlers/get-all-reviews.handler';
import { CreateReviewDto } from '../../domain/dto/create-review.dto';
import { UpdateReviewDto } from '../../domain/dto/update-review.dto';
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
        createReviewDto.firstName,
        createReviewDto.lastName,
        createReviewDto.email,
        createReviewDto.phone,
        createReviewDto.birthDate,
        createReviewDto.address,
      ),
    );
  }

  @Put(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.commandBus.execute(
      new UpdateReviewCommand(
        id,
        updateReviewDto.firstName,
        updateReviewDto.lastName,
        updateReviewDto.email,
        updateReviewDto.phone,
        updateReviewDto.birthDate,
        updateReviewDto.address,
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
  async getAllReviews(): Promise<Review[]> {
    return this.queryBus.execute(new GetAllReviewsQuery());
  }
}
