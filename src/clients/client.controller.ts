import {
  JsonController,
  Get,
  Authorized,
  QueryParam,
  BadRequestError,
  ForbiddenError,
  Param,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { ClientService } from './Client.service';

@JsonController('/clients')
export class ClientController {
  private readonly clientService = new ClientService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Client list with filter',
  })
  @Authorized(['admin', 'client'])
  @Get('', { transformResponse: false })
  async getClientList(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('category')
    category: string,
    @QueryParam('select')
    select: string,
  ) {
    try {
      if (!page || !limit) return null;
      return this.clientService.getClientList(page, limit, category, select);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Client Detail',
  })
  @Authorized(['admin', 'client'])
  @Get('/:client_id', { transformResponse: false })
  async getClientDetail(@Param('client_id') client_id: string) {
    try {
      return this.clientService.getClientDetailById(client_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
