import { getModelForClass, prop } from '@typegoose/typegoose';

export class Province {
  @prop()
  code: string;

  @prop()
  name: string;

  @prop()
  country_code: string;
}

export const ProvinceModel = getModelForClass(Province);
