import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateReviewCommand } from '../../domain/commands/create-review.command';
import { Inject, Logger } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateReviewEvent } from '../../domain/events/create-review.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler implements ICommandHandler<CreateReviewCommand> {
  private readonly logger = new Logger(CreateReviewHandler.name);

  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
  ) {}

  async execute(command: CreateReviewCommand): Promise<Review> {
    const review = this.reviewRepository.create({
      deliveryId: command.deliveryId,
      rating: command.rating,
      comment: command.comment,
      customerName: command.customerName,
      customerEmail: command.customerEmail,
    });

    const savedReview = await this.reviewRepository.save(review);

    const event = new CreateReviewEvent(
      savedReview.id,
      savedReview.deliveryId,
      savedReview.rating,
      savedReview.comment,
      savedReview.customerName,
      savedReview.customerEmail,
    );

    this.logger.log(`Review created with ID: ${savedReview.id}`);

    return savedReview;
  }
}