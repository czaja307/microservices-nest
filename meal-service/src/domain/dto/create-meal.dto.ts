import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  Min,
  Length,
} from 'class-validator';

export class CreateMealDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  preparationTimeMinutes: number;
}
