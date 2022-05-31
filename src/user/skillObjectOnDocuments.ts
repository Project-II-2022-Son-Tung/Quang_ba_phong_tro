import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class SkillObjectOnDocuments {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @prop({ required: true })
  name: string;

  @Expose()
  @IsOptional()
  slug?: string;

  @Expose()
  @IsOptional()
  image?: string;
}
