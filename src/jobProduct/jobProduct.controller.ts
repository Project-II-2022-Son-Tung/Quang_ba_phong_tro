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
import { ChangeJobDetailDto } from './dtos/changeJobDetail.dto';
import { CreateJobDto } from './dtos/createJob.dto';
import { JobProductService } from './jobProduct.service';

@JsonController('/jobs')
export class JobProductController {
  private readonly jobProductService = new JobProductService();

  @Post('')
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create new job',
  })
  async createJobProduct(
    @CurrentUser({ required: true }) client: CurrentUserOnRedisDocument,
    @Body() createJobDto: CreateJobDto,
  ) {
    await this.jobProductService.createJob(
      client._id,
      createJobDto,
    );
    return {
      message: 'Created Sucessfully',
    };
  }

  @Get('', { transformResponse: false })
  @OpenAPI({
    description: 'Get List Jobs',
  })
  async getJobList(
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
    @CurrentUser({ required: false }) user?: CurrentUserOnRedisDocument,
  ) {
    try {
      if (!page || !limit) return null;
      return this.jobProductService.getJobList(
        page,
        limit,
        user,
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

  @Get('/myJob', { transformResponse: false })
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get List Jobs Of Current User',
  })
  async getCurrentUserJobList(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
  ) {
    try {
      if (!page || !limit) return null;
      return this.jobProductService.getCurrentUserJobList(
        page,
        limit,
        user._id,
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/myJob/detail/:job_id', { transformResponse: false })
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Job Details Of Current User',
  })
  async getCurrentUserJobDetail(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('job_id') job_id: string,
  ) {
    try {
      return this.jobProductService.getCurrentUserJobDetail(
        user._id,
        job_id,
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/others/detail/:job_id', { transformResponse: false })
  @OpenAPI({
    description: 'Get Job Details Of Other User',
  })
  async getOtherUserJobDetail(
    @Param('job_id') job_id: string,
    @CurrentUser({ required: false }) user?: CurrentUserOnRedisDocument,
  ) {
    try {
      return this.jobProductService.getOtherUserJobDetail(
        user,
        job_id,
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Put('/:job_id')
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Change Job details',
  })
  async changeJobDetail(
    @Param('job_id') job_id: string,
    @CurrentUser({ required: true }) client: CurrentUserOnRedisDocument,
    @Body() changeJobDetailDto: ChangeJobDetailDto,
  ) {
    await this.jobProductService.changeJobDetails(
      job_id,
      client._id,
      changeJobDetailDto,
    );
    return {
      message: 'Change Sucessfully',
    };
  }

  @Patch('/toggle/:job_id')
  @Authorized(['client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Toggle job display status',
  })
  async toggleJobStatus(
    @Param('job_id') job_id: string,
    @CurrentUser({ required: true }) client: CurrentUserOnRedisDocument,
  ) {
    await this.jobProductService.changeJobDisplayStatus(
      job_id,
      client._id,
    );
    return {
      message: 'Change Sucessfully',
    };
  }

  @Patch('/approve/:job_id')
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Approve job by Id',
  })
  async approveJob(@Param('job_id') job_id: string) {
    await this.jobProductService.approveJob(job_id);
    return {
      message: 'Approved Sucessfully',
    };
  }

  @Delete('/:job_id')
  @Authorized(['admin', 'client'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Delete job by Id',
  })
  async deleteJob(
    @Param('job_id') job_id: string,
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
  ) {
    await this.jobProductService.deleteJob(
      user._id,
      user.type,
      job_id,
    );
    return {
      message: 'Deleted Sucessfully',
    };
  }
}
