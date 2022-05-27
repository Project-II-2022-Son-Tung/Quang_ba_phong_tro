import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(10)
  phone: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  @MinLength(1)
  fullname: string;
}
