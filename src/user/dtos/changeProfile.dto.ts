import { Expose, Type } from 'class-transformer';
import { IsString, IsDateString, IsOptional, MaxLength, MinLength, IsNumber, IsPositive, IsMongoId, IsArray, ValidateNested, ArrayMinSize, ArrayMaxSize, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { SocialMediaContact } from '../../social-media-contact/social-media-contact.model';
import { SkillObjectOnDocuments } from '../skillObjectOnDocuments';

export class ChangeProfileDto {
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

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsMongoId({each:true})
  category: Types.ObjectId[];

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => SkillObjectOnDocuments)
  skill: SkillObjectOnDocuments[];

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaContact)
  social_media_contact:SocialMediaContact[];
}
