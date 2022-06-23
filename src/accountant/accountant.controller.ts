import {
  JsonController,
  Get,
  QueryParam,
  BadRequestError,
  ForbiddenError,
  Param,
  Authorized,
  Put,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { AccountantService } from './accountant.service';

@JsonController('/accountants')
export class AccountantController {
  private readonly accountantService = new AccountantService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Accountant list with filter',
  })
  @Authorized(['admin'])
  @Get('', { transformResponse: false })
  async getAccountantList(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('select')
    select: string,
  ) {
    try {
      if (!page || !limit) return null;
      return this.accountantService.getAccountantList(page, limit, select);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Accountant Detail',
  })
  @Authorized(['admin'])
  @Get('/:accountant_id', { transformResponse: false })
  async getAccountantDetail(@Param('accountant_id') accountant_id: string) {
    try {
      return this.accountantService.getAccountantDetailById(accountant_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Change Accountant Profile',
  })
  @Authorized(['admin'])
  @Put('/:accountant_id', { transformResponse: false })
  async changeAccountantProfile(@Param('accountant_id') accountant_id: string) {
    try {
      return this.accountantService.getAccountantDetailById(accountant_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
