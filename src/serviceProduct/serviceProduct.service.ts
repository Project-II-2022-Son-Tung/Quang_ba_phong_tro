import { PopulateOptions } from 'mongoose';
import { BadRequestError } from 'routing-controllers';
import { ProductStatus } from '../product/product-status.enum';
import { toSlugConverter } from '../helper/toSlugConverter';
import { CreateServiceDto } from './dtos/createService.dto';
import { ServiceProductRepository } from './serviceProduct.repository';
import { AdminConfigService } from '../admin-config/adminConfig.service';

export class ServiceProductService {
  private readonly serviceProductRepository = new ServiceProductRepository();
  private readonly adminConfigService = new AdminConfigService();

  async createService(client_id: string, createServiceDto: CreateServiceDto) {
    if (
      createServiceDto.skill &&
      createServiceDto.skill.some((skill) => !skill.slug)
    ) {
      createServiceDto.skill = createServiceDto.skill.map((obj) => ({
        ...obj,
        slug: toSlugConverter(obj.name),
      })); // TODO : log new skills added by user to admins
    }
    Object.assign(createServiceDto, {
      status:
        await this.adminConfigService.getInitialCreateProductServiceStatus(),
    });
    return this.serviceProductRepository.createService(
      client_id,
      createServiceDto,
    );
  }

  async getServiceList(
    page: number,
    limit: number,
    curUserType: string,
    user_id: string,
    category: string,
    providing_method: string,
    fee_range: string,
    sort_by: string,
    select: string,
  ) {
    const query = { status: { $not: { $eq: ProductStatus.DELETED } } };
    const selectQuery = {};
    const populateQuery: PopulateOptions[] = [
      {
        path: 'user_id',
        select: 'fullname avatar email rate_star sold_time rate_number',
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
    if (curUserType == 'client') {
      Object.assign(query, { status: ProductStatus.ACTIVE });
      if (selectQuery['status'] === 1) selectQuery['status'] = 0;
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
      if (!selectQuery['category']) populateQuery.pop();
      if (!selectQuery['user_id']) populateQuery.shift();
    }
    const total =
      await this.serviceProductRepository.getNumberOfServiceWithFilter(query);
    const data = await this.serviceProductRepository.getServiceListWithPopulate(
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

  async getCurrentUserServiceList(
    page: number,
    limit: number,
    user_id: string,
  ) {
    const query = { user_id, status: { $not: { $eq: ProductStatus.DELETED } } };
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
    const sort_by: string = '';
    const total =
      await this.serviceProductRepository.getNumberOfServiceWithFilter(query);
    const data = await this.serviceProductRepository.getServiceListWithPopulate(
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

  async getCurrentUserServiceDetail(user_id: string, service_id: string) {
    const query = {
      _id: service_id,
      user_id,
      status: { $not: { $eq: ProductStatus.DELETED } },
    };
    const selectQuery = {};
    const populateQuery: PopulateOptions[] = [
      { path: 'category', select: '-description' },
    ];
    return this.serviceProductRepository.getServiceDetails(
      query,
      selectQuery,
      populateQuery,
    );
  }

  async getOtherUserServiceDetail(user_type: string, service_id: string) {
    const query = {
      _id: service_id,
      status: { $not: { $eq: ProductStatus.DELETED } },
    };
    const selectQuery = {};
    if (user_type === 'client') {
      Object.assign(query, { status: ProductStatus.ACTIVE });
      Object.assign(selectQuery, { status: 0 });
    }
    const populateQuery: PopulateOptions[] = [
      {
        path: 'user_id',
        select: 'fullname avatar email rate_star sold_time rate_number',
      },
      { path: 'category', select: '-description' },
    ];
    return this.serviceProductRepository.getServiceDetails(
      query,
      selectQuery,
      populateQuery,
    );
  }

  async changeServiceDetails(
    service_id: string,
    client_id: string,
    createServiceDto: CreateServiceDto,
  ) {
    const query = {
      _id: service_id,
      user_id: client_id,
      status: { $not: { $eq: ProductStatus.DELETED } },
    };
    if (
      createServiceDto.skill &&
      createServiceDto.skill.some((skill) => !skill.slug)
    ) {
      createServiceDto.skill = createServiceDto.skill.map((obj) => ({
        ...obj,
        slug: toSlugConverter(obj.name),
      })); // TODO : log new skills added by user to admins
    }
    const updatedService =
      await this.serviceProductRepository.changeServiceDetails(
        query,
        createServiceDto,
      );
    if (!updatedService)
      throw new BadRequestError(
        'Cannot update ! Not found or you are not the owner of service',
      );
  }

  async changeServiceDisplayStatus(service_id: string, client_id: string) {
    const query = {
      _id: service_id,
      user_id: client_id,
      status: { $in: [ProductStatus.ACTIVE, ProductStatus.INACTIVE] },
    };
    let newStatus: number;
    const toUpdateServiceProduct =
      await this.serviceProductRepository.getServiceAsMongooseDocument(query);
    if (!toUpdateServiceProduct)
      throw new BadRequestError(
        'Can not toggle display status for this service',
      );
    if (toUpdateServiceProduct.status === ProductStatus.ACTIVE)
      newStatus = ProductStatus.INACTIVE;
    else if (toUpdateServiceProduct.status === ProductStatus.INACTIVE)
      newStatus = ProductStatus.ACTIVE;
    toUpdateServiceProduct.status = newStatus;
    await this.serviceProductRepository.saveAServiceProduct(
      toUpdateServiceProduct,
    );
  }

  async approveService(service_id: string) {
    const query = { _id: service_id, status: ProductStatus.NEW };
    const updateOptions = { status: ProductStatus.ACTIVE };
    if (
      !(await this.serviceProductRepository.changeServiceDetails(
        query,
        updateOptions,
      ))
    )
      throw new BadRequestError(
        'Can not approve this service : not found or non-new service !',
      );
  }

  async deleteService(user_id: string, user_type: string, service_id: string) {
    const query = {
      _id: service_id,
      status: { $not: { $eq: ProductStatus.DELETED } },
    };
    if (user_type === 'client') Object.assign(query, { user_id });
    const updateOptions = { status: ProductStatus.DELETED };
    if (
      !(await this.serviceProductRepository.changeServiceDetails(
        query,
        updateOptions,
      ))
    )
      throw new BadRequestError('Can not delete this service : Not found !');
  }
}
