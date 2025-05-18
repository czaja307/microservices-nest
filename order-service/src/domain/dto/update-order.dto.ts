import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class UpdateOrderDto {
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
