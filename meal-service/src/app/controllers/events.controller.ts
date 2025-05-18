import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateOrderEvent } from '../../domain/events/create-order.event';
import { CreatePaymentEvent } from '../../domain/events/create-payment.event';
import { CreateOrderPreparationCommand } from '../../domain/commands/create-order-preparation.command';

interface OrderCache {
  orderId: string;
  mealIds: string[];
}

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  private readonly orderCache: Map<string, OrderCache> = new Map();

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(CreateOrderEvent.name)
  async handleOrderCreated(@Payload() data: string) {
    this.logger.log(`CreateOrderEvent received: ${data}`);
    const order = CreateOrderEvent.fromJSON(data);

    this.orderCache.set(order.id, { orderId: order.id, mealIds: [] });

    this.logger.log(
      `Order ${order.id} cached. Waiting for payment confirmation.`,
    );
  }

  @EventPattern(CreatePaymentEvent.name)
  async handlePaymentCreated(@Payload() data: string) {
    this.logger.log(`CreatePaymentEvent received: ${data}`);
    const payment = JSON.parse(data);

    if (payment.paymentStatus === 'Accepted') {
      const cachedOrder = this.orderCache.get(payment.orderId);

      if (cachedOrder) {
        this.logger.log(
          `Payment confirmed for order ${payment.orderId}. Starting meal preparation.`,
        );
        await this.commandBus.execute(
          new CreateOrderPreparationCommand(
            cachedOrder.orderId,
            cachedOrder.mealIds,
          ),
        );
        this.orderCache.delete(payment.orderId); // Remove from cache after processing
      } else {
        this.logger.warn(
          `No cached order found for payment ${payment.orderId}.`,
        );
      }
    } else {
      this.logger.log(
        `Payment for order ${payment.orderId} is not secured. Status: ${payment.paymentStatus}`,
      );
    }
  }
}
