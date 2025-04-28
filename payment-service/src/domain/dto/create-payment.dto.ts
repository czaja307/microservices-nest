import { IsString, IsNotEmpty, IsUUID, IsNumber, IsIn } from 'class-validator';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { PaymentStatusEnum } from '../enums/payment-status.enum';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(PaymentMethodEnum))
  paymentMethod: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(PaymentStatusEnum))
  paymentStatus: string;
}