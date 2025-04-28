import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min, Length } from 'class-validator';

export class UpdateMealDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  preparationTimeMinutes?: number;
}