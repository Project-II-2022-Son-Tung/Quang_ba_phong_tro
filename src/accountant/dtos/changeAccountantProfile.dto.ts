import { Expose } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsOptional,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsEnum,
  IsIn,
} from 'class-validator';
import { UserStatus } from 'src/user/enums/user-status.enum';

export class ChangeAccountantProfileDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  phone: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @MinLength(1)
  fullname: string;

  @Expose()
  @IsOptional()
  @IsEnum(UserStatus)
  @IsIn([UserStatus.ACTIVE, UserStatus.INACTIVE])
  status: UserStatus;

  @Expose()
  @IsOptional()
  @IsDateString()
  birthday: Date;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @MinLength(1)
  address: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @MinLength(1)
  introduction: string;
}
