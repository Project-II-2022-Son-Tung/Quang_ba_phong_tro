import {
  JsonController,
  Get,
  QueryParam,
  BadRequestError,
  ForbiddenError,
  Param,
  CurrentUser,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
import { ClientService } from './client.service';

@JsonController('/clients')
export class ClientController {
  private readonly clientService = new ClientService();

  @OpenAPI({
    description: 'Get Client list with filter',
  })
  @Get('', { transformResponse: false })
  async getClientList(
    @CurrentUser({ required: false }) user: CurrentUserOnRedisDocument,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('category')
    category: string,
    @QueryParam('address')
    address: string,
    @QueryParam('select')
    select: string,
  ) {
    try {
      if (!page || !limit) return null;
      return this.clientService.getClientList(
        user,
        page,
        limit,
        category,
        address,
        select,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    description: 'Get Client Detail',
  })
  @Get('/:client_id', { transformResponse: false })
  async getClientDetail(
    @CurrentUser({ required: false }) user: CurrentUserOnRedisDocument,
    @Param('client_id') client_id: string,
  ) {
    try {
      return this.clientService.getClientDetailById(user, client_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
