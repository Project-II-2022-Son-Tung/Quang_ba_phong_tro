import { SkillRepository } from './skill.repository';

export class SkillService {
  private readonly skillRepository = new SkillRepository();

  async getAllSkills() {
    return this.skillRepository.getAllSkills();
  }

  async getSkillBySlug(slug: string): Promise<string | null> {
    return this.skillRepository.getSkillBySlug(slug);
  }
}
