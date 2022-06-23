import { Expose } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Types } from 'mongoose';
export class CreateDraftDto {
  @Expose()
  @IsOptional()
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
}
