import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
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
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  password: string;

  @Expose()
  @IsOptional()
  @IsString()
  phone: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  fullname: string;
}
