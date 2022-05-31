import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { isLaterThanCurrentDate } from '../../customValidators/isLaterThanCurrentDate.validator';
import { IsLargerOrEqual } from '../../customValidators/isLargerOrEqual.validator';
import { ProductProvidingMethod } from '../../product/product-providing-method.enum';
import { SkillObjectOnDocuments } from '../../user/skillObjectOnDocuments';
import { isNotLaterThan } from '../../customValidators/isNotLaterThan.validator';

export class ChangeServiceDetailDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(10)
  @IsMongoId({ each: true })
  category: ObjectId[];

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayUnique((skill) => skill.name)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => SkillObjectOnDocuments)
  skill: SkillObjectOnDocuments[];

  @Expose()
  @IsOptional()
  description: string;

  @Expose()
  @IsNotEmpty()
  @ArrayUnique()
  @ArrayMaxSize(Object.keys(ProductProvidingMethod).length)
  @IsEnum(ProductProvidingMethod, { each: true })
  providing_method: ProductProvidingMethod[];

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(525949)
  finish_estimated_time: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100000)
  lower_bound_fee: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsLargerOrEqual('lower_bound_fee', {
    message: 'upper_bound_fee must larger or equal lower_bound_fee',
  })
  @Max(100000)
  upper_bound_fee: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsUrl({ each: true })
  image: string[];

  @Expose()
  @IsNotEmpty()
  @IsDateString()
  @isLaterThanCurrentDate({
    message: 'The expiration_time must greater than current time',
  })
  @isNotLaterThan(12, {
    message: 'The service must not expired later than one year from now',
  })
  expiration_time: Date;
}
