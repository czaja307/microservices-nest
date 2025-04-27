import { IsString, IsEmail, IsDate, IsNotEmpty, Length } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;

  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  address: string;
}
