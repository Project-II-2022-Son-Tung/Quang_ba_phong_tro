import { SkillDocument, SkillModel } from './skill.model';

export class SkillRepository {
  async getAllSkills(): Promise<SkillDocument[] | null> {
    return SkillModel.find().lean();
  }

  async getSkillBySlug(slug: string): Promise<string | null> {
    const skill = await SkillModel.findOne({ slug }).lean();
    return skill?._id;
  }
}
