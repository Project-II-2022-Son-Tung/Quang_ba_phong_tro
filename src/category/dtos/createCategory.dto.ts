import { Expose } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
export class CreateCategoryDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description: string;

  @Expose()
  @IsUrl()
  @IsOptional()
  image: string;

  @Expose()
  @IsMongoId()
  @IsOptional()
  parent_category: Types.ObjectId;

  @Expose()
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  priority: number;
}
