import { IsString, IsArray, IsNumber, IsOptional, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsArray()
  @IsOptional()
  meals?: string[];

  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @IsString()
  @IsOptional()
  @IsIn(['Paid', 'Pending', 'Failed'])
  paymentStatus?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Processing', 'Completed', 'Cancelled'])
  orderStatus?: string;
}