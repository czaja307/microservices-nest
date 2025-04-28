import { IsString, IsEmail, IsInt, IsNotEmpty, Length, IsUUID, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  deliveryId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  customerName: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;
}