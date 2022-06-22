/* eslint-disable no-param-reassign */
import { PopulateOptions } from 'mongoose';
import { BadRequestError } from 'routing-controllers';
import { CurrentUserOnRedisDocument } from 'src/user/currentUserOnRedis.interface';
import { ProductStatus } from '../product/product-status.enum';
import { toSlugConverter } from '../helper/toSlugConverter';
import { CreateJobDto } from './dtos/createJob.dto';
import { JobProductRepository } from './jobProduct.repository';
import { AdminConfigService } from '../admin-config/adminConfig.service';
import { ChangeJobDetailDto } from './dtos/changeJobDetail.dto';

export class JobProductService {
  private readonly jobProductRepository = new JobProductRepository();

  private readonly adminConfigService = new AdminConfigService();

  async createJob(client_id: string, createJobDto: CreateJobDto) {
    if (createJobDto.skill && createJobDto.skill.some((skill) => !skill.slug)) {
      createJobDto.skill = createJobDto.skill.map((obj) => ({
        ...obj,
        slug: toSlugConverter(obj.name),
      })); // TODO : log new skills added by user to admins
    }
    Object.assign(createJobDto, {
      status: await this.adminConfigService.getInitialCreateJobServiceStatus(),
    });
    return this.jobProductRepository.createJob(client_id, createJobDto);
  }

  async getJobList(
    page: number,
    limit: number,
    currentUser: CurrentUserOnRedisDocument,
    user_id: string,
    category: string,
    providing_method: string,
    fee_range: string,
    sort_by: string,
    select: string,
  ) {
    const query = { status: ProductStatus.ACTIVE };
    const selectQuery: {
      category?: number;
      user_id?: number;
      [query: string]: number;
    } = {};
    const populateQuery: PopulateOptions[] = [
      {
        path: 'user_id',
        select: 'fullname avatar email',
      },
      { path: 'category', select: '-description' },
    ];
    if (user_id) Object.assign(query, { user_id: { $in: user_id.split(',') } });
    if (category)
      Object.assign(query, { category: { $in: category.split(',') } });
    if (providing_method)
      Object.assign(query, {
        providing_method: { $in: providing_method.split(',') },
      });
    if (currentUser && currentUser.type === 'admin') {
      Object.assign(query, {
        status: { $not: { $eq: ProductStatus.DELETED } },
      });
    }
    if (fee_range) {
      const [minFee, maxFee] = fee_range.split('-').map(Number);
      Object.assign(query, {
        lower_bound_fee: { $lte: maxFee },
        upper_bound_fee: { $gte: minFee },
      });
    }
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        selectQuery[value] = 1;
      });
      if (!selectQuery.category) populateQuery.pop();
      if (!selectQuery.user_id) populateQuery.shift();
    }
    const total = await this.jobProductRepository.getNumberOfJobWithFilter(
      query,
    );
    const data = await this.jobProductRepository.getJobListWithPopulate(
      page,
      limit,
      query,
      selectQuery,
      populateQuery,
      sort_by,
    );
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getCurrentUserJobList(page: number, limit: number, client_id: string) {
    const query = {
      user_id: client_id,
      status: { $not: { $eq: ProductStatus.DELETED } },
    };
    const selectQuery = {
      image: 1,
      name: 1,
      upper_bound_fee: 1,
      lower_bound_fee: 1,
      sold_time: 1,
      rate: 1,
      number_of_rate: 1,
      create_time: 1,
      status: 1,
    };
    const populateQuery: PopulateOptions[] = [];
    const sort_by = '';
    const total = await this.jobProductRepository.getNumberOfJobWithFilter(
      query,
    );
    const data = await this.jobProductRepository.getJobListWithPopulate(
      page,
      limit,
      query,
      selectQuery,
      populateQuery,
      sort_by,
    );
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getCurrentUserJobDetail(client_id: string, job_id: string) {
    const query = {
      _id: job_id,
      user_id: client_id,
      status: { $not: { $eq: ProductStatus.DELETED } },
    };
    const selectQuery = {};
    const populateQuery: PopulateOptions[] = [
      { path: 'category', select: '-description' },
    ];
    return this.jobProductRepository.getJobDetails(
      query,
      selectQuery,
      populateQuery,
    );
  }

  async getOtherUserJobDetail(
    currentUser: CurrentUserOnRedisDocument,
    job_id: string,
  ) {
    const query = {
      _id: job_id,
      status: ProductStatus.ACTIVE,
    };
    const selectQuery = {};
    if (currentUser && currentUser.type === 'admin') {
      Object.assign(query, {
        status: { $not: { $eq: ProductStatus.DELETED } },
      });
    }
    const populateQuery: PopulateOptions[] = [
      {
        path: 'user_id',
        select: 'fullname avatar email',
      },
      { path: 'category', select: '-description' },
    ];
    return this.jobProductRepository.getJobDetails(
      query,
      selectQuery,
      populateQuery,
    );
  }

  async changeJobDetails(
    job_id: string,
    client_id: string,
    changeJobDto: ChangeJobDetailDto,
  ) {
    const query = {
      _id: job_id,
      user_id: client_id,
      status: { $not: { $eq: ProductStatus.DELETED } },
    };
    if (changeJobDto.skill && changeJobDto.skill.some((skill) => !skill.slug)) {
      changeJobDto.skill = changeJobDto.skill.map((obj) => ({
        ...obj,
        slug: toSlugConverter(obj.name),
      })); // TODO : log new skills added by user to admins
    }
    const updatedJob = await this.jobProductRepository.changeJobDetails(
      query,
      changeJobDto,
    );
    if (!updatedJob)
      throw new BadRequestError(
        'Cannot update ! Not found or you are not the owner of job',
      );
  }

  async changeJobDisplayStatus(job_id: string, client_id: string) {
    const query = {
      _id: job_id,
      user_id: client_id,
      status: { $in: [ProductStatus.ACTIVE, ProductStatus.INACTIVE] },
    };
    let newStatus: number;
    const toUpdateJobProduct =
      await this.jobProductRepository.getJobAsMongooseDocument(query);
    if (!toUpdateJobProduct)
      throw new BadRequestError('Can not toggle display status for this job');
    if (toUpdateJobProduct.status === ProductStatus.ACTIVE)
      newStatus = ProductStatus.INACTIVE;
    else if (toUpdateJobProduct.status === ProductStatus.INACTIVE)
      newStatus = ProductStatus.ACTIVE;
    toUpdateJobProduct.status = newStatus;
    await this.jobProductRepository.saveAJobProduct(toUpdateJobProduct);
  }

  async approveJob(job_id: string) {
    const query = { _id: job_id, status: ProductStatus.NEW };
    const updateOptions = { status: ProductStatus.ACTIVE };
    if (
      !(await this.jobProductRepository.changeJobDetails(query, updateOptions))
    )
      throw new BadRequestError(
        'Can not approve this job : not found or non-new job !',
      );
  }

  async deleteJob(user_id: string, user_type: string, job_id: string) {
    const query = {
      _id: job_id,
      status: { $not: { $eq: ProductStatus.DELETED } },
    };
    if (user_type === 'client') Object.assign(query, { user_id });
    const updateOptions = { status: ProductStatus.DELETED };
    if (
      !(await this.jobProductRepository.changeJobDetails(query, updateOptions))
    )
      throw new BadRequestError('Can not delete this job : Not found !');
  }
}
