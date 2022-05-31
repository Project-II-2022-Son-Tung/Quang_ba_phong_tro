import {
  JsonController,
  Authorized,
  Post,
  CurrentUser,
  Body,
  Get,
  QueryParam,
  BadRequestError,
  Param,
  Put,
  Patch,
  Delete,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
import { ChangeServiceDetailDto } from './dtos/changeServiceDetail.dto';
import { CreateServiceDto } from './dtos/createService.dto';
import { ServiceProductService } from './serviceProduct.service';

@JsonController('/services')
export class ServiceProductController {
  private readonly serviceProductService = new ServiceProductService();

  @Post('')
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create new service',
  })
  async createServiceProduct(
    @CurrentUser({ required: true }) client: CurrentUserOnRedisDocument,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    await this.serviceProductService.createService(
      client._id,
      createServiceDto,
    );
    return {
      message: 'Created Sucessfully',
    };
  }

  @Get('', { transformResponse: false })
  @Authorized(['admin', 'client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get List Services',
  })
  async getServiceList(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('user_id')
    user_id: string,
    @QueryParam('category')
    category: string,
    @QueryParam('providing_method')
    providing_method: string,
    @QueryParam('fee_range')
    fee_range: string,
    @QueryParam('sort')
    sort_by: string,
    @QueryParam('select')
    select: string,
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
  ) {
    try {
      if (!page || !limit) return null;
      return this.serviceProductService.getServiceList(
        page,
        limit,
        user.type,
        user_id,
        category,
        providing_method,
        fee_range,
        sort_by,
        select,
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/myService', { transformResponse: false })
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get List Services Of Current User',
  })
  async getCurrentUserServiceList(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
  ) {
    try {
      if (!page || !limit) return null;
      return this.serviceProductService.getCurrentUserServiceList(
        page,
        limit,
        user._id,
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/myService/detail/:service_id', { transformResponse: false })
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Service Details Of Current User',
  })
  async getCurrentUserServiceDetail(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('service_id') service_id: string,
  ) {
    try {
      return this.serviceProductService.getCurrentUserServiceDetail(
        user._id,
        service_id,
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/others/detail/:service_id', { transformResponse: false })
  @Authorized(['client', 'admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Service Details Of Other User',
  })
  async getOtherUserServiceDetail(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('service_id') service_id: string,
  ) {
    try {
      return this.serviceProductService.getOtherUserServiceDetail(
        user.type,
        service_id,
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Put('/:service_id')
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Change service details',
  })
  async changeServiceDetail(
    @Param('service_id') service_id: string,
    @CurrentUser({ required: true }) client: CurrentUserOnRedisDocument,
    @Body() changeServiceDetailDto: ChangeServiceDetailDto,
  ) {
    await this.serviceProductService.changeServiceDetails(
      service_id,
      client._id,
      changeServiceDetailDto,
    );
    return {
      message: 'Change Sucessfully',
    };
  }

  @Patch('/toggle/:service_id')
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Toggle service display status',
  })
  async toggleServiceStatus(
    @Param('service_id') service_id: string,
    @CurrentUser({ required: true }) client: CurrentUserOnRedisDocument,
  ) {
    await this.serviceProductService.changeServiceDisplayStatus(
      service_id,
      client._id,
    );
    return {
      message: 'Change Sucessfully',
    };
  }

  @Patch('/approve/:service_id')
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Approve service by Id',
  })
  async approveService(@Param('service_id') service_id: string) {
    await this.serviceProductService.approveService(service_id);
    return {
      message: 'Approved Sucessfully',
    };
  }

  @Delete('/:service_id')
  @Authorized(['admin', 'client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Delete service by Id',
  })
  async deleteService(
    @Param('service_id') service_id: string,
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
  ) {
    await this.serviceProductService.deleteService(
      user._id,
      user.type,
      service_id,
    );
    return {
      message: 'Deleted Sucessfully',
    };
  }
}
