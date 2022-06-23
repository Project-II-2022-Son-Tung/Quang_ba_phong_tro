import { Expose } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
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
export class UpdateNewsDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsMongoId({ each: true })
  category: Types.ObjectId[];

  @Expose()
  @IsUrl()
  @IsOptional()
  thumbnail: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Expose()
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  priority: number;
}
