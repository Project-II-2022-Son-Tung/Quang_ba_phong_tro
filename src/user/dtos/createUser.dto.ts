import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../enums/user-type.enum';

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
  @IsNotEmpty()
  @IsEnum(UserType)
  @IsString()
  @IsIn(['admin', 'accountant'])
  type: UserType;

  @Expose()
  @IsOptional()
  @IsString()
  phone: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  fullname: string;
}
