import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Length,
  IsNotEmpty,
} from 'class-validator';
import { DeliveryStatus } from '../entities/delivery.entity';

export class CreateDeliveryDto {
  @IsUUID()
  @IsString()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  deliveryAddress: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  recipientPhone: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  recipientName: string;

  @IsEnum(DeliveryStatus)
  @IsOptional()
  status?: string = DeliveryStatus.PENDING;

  @IsInt()
  @Min(1)
  @IsOptional()
  estimatedDeliveryMinutes?: number;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  notes?: string;
}
