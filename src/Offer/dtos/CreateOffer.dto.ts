import { Expose } from 'class-transformer';
import { IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateOfferDto {
  @Expose()
  @IsPositive()
  @IsOptional()
  offer_price: number;

  @Expose()
  @IsPositive()
  @IsOptional()
  offer_finish_estimated_time: number;

  @Expose()
  @IsString()
  @MinLength(20)
  @IsOptional()
  introduction: string;
}
