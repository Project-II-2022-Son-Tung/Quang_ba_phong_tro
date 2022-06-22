import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { toSlugConverter } from '../helper/toSlugConverter';

export class Skill {
  @prop({ required: true })
  name: string;

  @prop({
    default: function getDefaultSkillSlug(this: DocumentType<Skill>) {
      return toSlugConverter(this.name);
    },
  })
  slug: string;

  @prop({ required: false })
  description: string;

  @prop({ required: false })
  image: string;
}

export type SkillDocument = DocumentType<Skill>;
export const SkillModel = getModelForClass(Skill);
