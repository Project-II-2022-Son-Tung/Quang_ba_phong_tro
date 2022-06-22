import { PopulateOptions, UpdateQuery } from 'mongoose';
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
      ...createServiceDto,
    });
  }

  async getServiceListWithPopulate(
    page: number,
    limit: number,
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
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
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
  ): Promise<ServiceProductDocument[] | null> {
    return ServiceProductModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getServiceDetails(
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
    populateOptions: PopulateOptions[],
  ): Promise<ServiceProductDocument | null> {
    return ServiceProductModel.findOne(query)
      .select(selectQuery)
      .populate(populateOptions)
      .lean();
  }

  async getServiceAsMongooseDocument(
    query: Record<string, unknown>,
  ): Promise<ServiceProductDocument | null> {
    return ServiceProductModel.findOne(query);
  }

  async getNumberOfServiceWithFilter(
    query: Record<string, unknown>,
  ): Promise<number> {
    return ServiceProductModel.countDocuments(query);
  }

  async changeServiceDetails(
    query: Record<string, unknown>,
    updateOptions: UpdateQuery<ServiceProduct>,
  ) {
    return ServiceProductModel.findOneAndUpdate(query, updateOptions, {
      new: true,
    });
  }

  async changeServiceStatus(query: Record<string, unknown>, newStatus: number) {
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
