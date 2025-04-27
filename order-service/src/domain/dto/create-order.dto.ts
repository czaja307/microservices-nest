import { IsString, IsNotEmpty, IsArray, IsNumber, IsIn } from 'class-validator';
import { PaymentStatusEnum } from '../enums/payment-status.enum';
import { OrderStatusEnum } from '../enums/order-status.enum';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsArray()
  @IsNotEmpty()
  meals: string[];

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsString()
  @IsIn(Object.values(PaymentStatusEnum))
  paymentStatus: string;

  @IsString()
  @IsIn(Object.values(OrderStatusEnum))
  orderStatus: string;
}