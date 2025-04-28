import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateDeliveryCommand } from '../../domain/commands/create-delivery.command';

// Define the OrderPreparationStatusEvent structure
interface OrderPreparationStatusEvent {
  orderId: string;
  status: string;
  estimatedCompletionMinutes: number;
}

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('OrderPreparationStatusEvent')
  async handleOrderPreparationStatus(@Payload() data: string) {
    this.logger.log(`OrderPreparationStatusEvent received: ${data}`);
    const event: OrderPreparationStatusEvent = JSON.parse(data);

    // Only create delivery when status is READY
    if (event.status === 'Ready') {
      this.logger.log(`Order ${event.orderId} is ready for delivery`);

      // Mock customer details (in a real app, these would come from the order service)
      const mockCustomerName = `Customer-${Math.floor(Math.random() * 1000)}`;
      const mockAddress = `${Math.floor(Math.random() * 1000)} Main St, City`;
      const mockPhone = `555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      // Create a delivery for this order
      await this.commandBus.execute(
        new CreateDeliveryCommand(
          event.orderId,
          mockAddress,
          mockPhone,
          mockCustomerName,
          undefined, // Use default status
          30, // Estimated delivery time in minutes
          'Created automatically when meal preparation was completed'
        ),
      );
    }
  }
}