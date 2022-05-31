import { PopulateOptions, UpdateQuery } from 'mongoose';
import { ProductStatus } from '../product/product-status.enum';
import { CreateServiceDto } from './dtos/createService.dto';
import {
  ServiceProduct,
  ServiceProductDocument,
  ServiceProductModel,
} from './serviceProduct.model';

export class ServiceProductRepository {
  async createService(client_id: string, createServiceDto: CreateServiceDto) {
    await ServiceProductModel.create({
      user_id: client_id,
      status: ProductStatus.ACTIVE,
      ...createServiceDto,
    });
  }

  async getServiceListWithPopulate(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
    populateOptions: PopulateOptions[],
    sortQuery: string,
  ): Promise<ServiceProductDocument[] | null> {
    return ServiceProductModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(populateOptions)
      .sort(sortQuery)
      .lean();
  }

  async getServiceListWithNoPopulate(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<ServiceProductDocument[] | null> {
    return ServiceProductModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getServiceDetails(
    query: {},
    selectQuery: {},
    populateOptions: PopulateOptions[],
  ): Promise<ServiceProductDocument | null> {
    return ServiceProductModel.findOne(query)
      .select(selectQuery)
      .populate(populateOptions)
      .lean();
  }

  async getServiceAsMongooseDocument(query: {}): Promise<ServiceProductDocument | null> {
    return ServiceProductModel.findOne(query);
  }

  async getNumberOfServiceWithFilter(query: {}): Promise<number> {
    return ServiceProductModel.countDocuments(query);
  }

  async changeServiceDetails(
    query: {},
    updateOptions: UpdateQuery<ServiceProduct>,
  ) {
    return ServiceProductModel.findOneAndUpdate(query, updateOptions, {
      new: true,
    });
  }

  async changeServiceStatus(query: {}, newStatus: number) {
    return ServiceProductModel.findOneAndUpdate(
      query,
      {
        status: newStatus,
      },
      {
        new: true,
      },
    );
  }

  async saveAServiceProduct(serviceProductDocument: ServiceProductDocument) {
    await serviceProductDocument.save();
  }
}
