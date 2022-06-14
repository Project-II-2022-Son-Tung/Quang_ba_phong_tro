import { Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketMessageDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  ticket_id: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  message: string;
}
