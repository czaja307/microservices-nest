import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateReviewCommand } from '../../domain/commands/update-review.command';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateReviewEvent } from '../../domain/events/update-review.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(UpdateReviewCommand)
export class UpdateReviewHandler
  implements ICommandHandler<UpdateReviewCommand>
{
  private readonly logger = new Logger(UpdateReviewHandler.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateReviewCommand): Promise<Review> {
    const { id, firstName, lastName, email, phone, birthDate, address } =
      command;
    this.logger.log(`Attempting to update review with ID: ${id}`);

    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      this.logger.warn(`Review with ID ${id} not found.`);
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    review.firstName = firstName;
    review.lastName = lastName;
    review.email = email;
    review.phone = phone;
    review.birthDate = birthDate;
    review.address = address;

    const updatedReview = await this.reviewRepository.save(review);

    const event = new UpdateReviewEvent(
      updatedReview.id,
      updatedReview.firstName,
      updatedReview.lastName,
      updatedReview.email,
      updatedReview.phone,
      updatedReview.birthDate,
      updatedReview.address,
    );

    this.eventBus.publish(event);
    this.client.emit(UpdateReviewEvent.name, event.toJSON());
    this.logger.log(`Review with ID ${id} updated successfully and event emitted.`);
    return updatedReview;
  }
}