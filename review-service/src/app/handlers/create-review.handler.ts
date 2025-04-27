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
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateReviewCommand): Promise<Review> {
    const review = this.reviewRepository.create({
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      birthDate: command.birthDate,
      address: command.address,
    });

    const savedReview = await this.reviewRepository.save(review);

    const event = new CreateReviewEvent(
      savedReview.id,
      savedReview.firstName,
      savedReview.lastName,
      savedReview.email,
      savedReview.phone,
      savedReview.birthDate,
      savedReview.address,
    );

    this.eventBus.publish(event);
    this.client.emit(CreateReviewEvent.name, event.toJSON());
    this.logger.log(`Review created with ID: ${savedReview.id}`);

    return savedReview;
  }
}