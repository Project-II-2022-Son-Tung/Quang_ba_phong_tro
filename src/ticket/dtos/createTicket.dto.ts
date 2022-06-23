import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsIn(['order','transaction', 'other'])
  type: string;

  @Expose()
  @IsOptional()
  @IsString()
  object: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  content: string;
}
