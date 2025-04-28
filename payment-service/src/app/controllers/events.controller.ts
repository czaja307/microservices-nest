import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateOrderEvent } from '../../domain/events/create-order.event';
import { CreatePaymentCommand } from '../../domain/commands/create-payment.command';
import { PaymentMethodEnum } from '../../domain/enums/payment-method.enum';

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(CreateOrderEvent.name)
  async handleTranscriptionGenerated(@Payload() data: string) {
    this.logger.log(`CreateOrderEvent received: ${data}`);
    const payment = CreateOrderEvent.fromJSON(data);

    this.logger.log(`Generating payment for order: ${payment.id}`);


    const paymentMethod = Object.values(PaymentMethodEnum)[Math.floor(Math.random() * Object.values(PaymentMethodEnum).length)];
    await this.commandBus.execute(
      new CreatePaymentCommand(
        payment.id,
        paymentMethod,
        payment.totalPrice,
        'Accepted',
      ),
    );
  }
}