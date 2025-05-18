import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateReviewCommand } from '../../domain/commands/create-review.command';
import { CreateDeliveryEvent } from '../../domain/events/create-delivery.event';

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(CreateDeliveryEvent.name)
  async handleDeliveryCompleted(@Payload() data: string) {
    this.logger.log(`DeliveryCompletedEvent received: ${data}`);
    const event: CreateDeliveryEvent = JSON.parse(data);

    // Only request reviews for completed deliveries

    this.logger.log(`Requesting review for delivery ${event.id}`);

    try {
      // In a real system, we'd probably send an email to the customer
      // requesting a review, but for this example we'll create a pending review

      // Create a placeholder review that can be updated later
      await this.commandBus.execute(
        new CreateReviewCommand(
          event.id,
          4,
          'Please update with your feedback',
          event.recipientName,
        ),
      );

      this.logger.log(`Review request created for delivery ${event.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to create review request for delivery ${event.id}: ${error.message}`,
      );
    }
  }
}
