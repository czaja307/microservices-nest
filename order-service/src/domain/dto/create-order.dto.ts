import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

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
}
