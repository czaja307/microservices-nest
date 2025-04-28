import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateOrderEvent } from '../../domain/events/create-order.event';
import { CreatePaymentEvent } from '../../domain/events/create-payment.event';
import { CreateOrderPreparationCommand } from '../../domain/commands/create-order-preparation.command';

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(CreateOrderEvent.name)
  async handleOrderCreated(@Payload() data: string) {
    this.logger.log(`CreateOrderEvent received: ${data}`);
    const order = CreateOrderEvent.fromJSON(data);

    // Extract meal IDs from order meals (assuming meal names are sent)
    // In a real application, you would look up the meal IDs by name
    // Mock meal IDs - in a real app these would come from a DB lookup
    const mockMealIds = order.meals.map(name => `meal-${name.replace(/\s+/g, '-').toLowerCase()}`);

    this.logger.log(`Starting meal preparation for order: ${order.id}`);
    await this.commandBus.execute(
      new CreateOrderPreparationCommand(
        order.id,
        mockMealIds
      ),
    );
  }

  @EventPattern(CreatePaymentEvent.name)
  async handlePaymentCreated(@Payload() data: string) {
    this.logger.log(`CreatePaymentEvent received: ${data}`);
    const payment = JSON.parse(data);

    if (payment.paymentStatus === 'Paid') {
      this.logger.log(`Payment confirmed for order ${payment.orderId}, proceeding with meal preparation`);
      // In a real application, you might update the order status or take additional actions
    }
  }
}