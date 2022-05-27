import { JsonController, Get } from 'routing-controllers';
import { SkillService } from './skill.service';

@JsonController('/skills')
export class SkillController {
  private readonly skillService = new SkillService();

  @Get('', { transformResponse: false })
  async getAllskills() {
    return this.skillService.getAllSkills();
  }
}
