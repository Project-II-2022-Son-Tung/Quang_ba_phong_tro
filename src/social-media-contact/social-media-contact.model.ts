import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class SocialMediaContact {
  @Expose()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @Expose()
  @IsOptional()
  @IsUrl()
  logo?: string;
}
