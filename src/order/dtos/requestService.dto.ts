import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class RequestServiceDto {
  @Expose()
  @IsNotEmpty()
  note: string;

  @Expose()
  @IsOptional()
  @IsPositive()
  price?: number;
}
