import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrderType } from '../order-type';

export class CreateOrderDto {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  client_id: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  provider_id: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(OrderType)
  type: OrderType;

  @Expose()
  @IsNotEmpty()
  price: number;

  @Expose()
  @IsNotEmpty()
  note: string;

  @Expose()
  @IsNotEmpty()
  estimatedTime: number;
}
