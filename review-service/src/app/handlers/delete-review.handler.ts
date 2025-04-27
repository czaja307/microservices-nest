import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteReviewCommand } from '../../domain/commands/delete-review.command';
import { Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../../domain/entities/review.entity';
import { Repository } from 'typeorm';
import { DeleteReviewEvent } from '../../domain/events/delete-review.event';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DeleteReviewCommand)
export class DeleteReviewHandler
  implements ICommandHandler<DeleteReviewCommand>
{
  private readonly logger = new Logger(DeleteReviewHandler.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteReviewCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Attempting to delete review with ID: ${id}`);

    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      this.logger.warn(`Review with ID ${id} not found.`);
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.reviewRepository.delete(id);

    const event = new DeleteReviewEvent(id);
    this.eventBus.publish(event);
    this.client.emit(DeleteReviewEvent.name, event.toJSON());
    this.logger.log(`Review with ID ${id} deleted successfully and event emitted.`);
  }
}