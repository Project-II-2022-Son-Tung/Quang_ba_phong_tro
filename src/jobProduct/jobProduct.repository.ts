import { PopulateOptions, UpdateQuery } from 'mongoose';
import { CreateJobDto } from './dtos/createJob.dto';
import {
  JobProduct,
  JobProductDocument,
  JobProductModel,
} from './jobProduct.model';

export class JobProductRepository {
  async createJob(client_id: string, createJobDto: CreateJobDto) {
    await JobProductModel.create({
      user_id: client_id,
      ...createJobDto,
    });
  }

  async getJobListWithPopulate(
    page: number,
    limit: number,
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
    populateOptions: PopulateOptions[],
    sortQuery: string,
  ): Promise<JobProductDocument[] | null> {
    return JobProductModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(populateOptions)
      .sort(sortQuery)
      .lean();
  }

  async getJobListWithNoPopulate(
    page: number,
    limit: number,
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
  ): Promise<JobProductDocument[] | null> {
    return JobProductModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getJobDetails(
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
    populateOptions: PopulateOptions[],
  ): Promise<JobProductDocument | null> {
    return JobProductModel.findOne(query)
      .select(selectQuery)
      .populate(populateOptions)
      .lean();
  }

  async getJobAsMongooseDocument(
    query: Record<string, unknown>,
  ): Promise<JobProductDocument | null> {
    return JobProductModel.findOne(query);
  }

  async getNumberOfJobWithFilter(
    query: Record<string, unknown>,
  ): Promise<number> {
    return JobProductModel.countDocuments(query);
  }

  async changeJobDetails(
    query: Record<string, unknown>,
    updateOptions: UpdateQuery<JobProduct>,
  ) {
    return JobProductModel.findOneAndUpdate(query, updateOptions, {
      new: true,
    });
  }

  async changeJobStatus(query: Record<string, unknown>, newStatus: number) {
    return JobProductModel.findOneAndUpdate(
      query,
      {
        status: newStatus,
      },
      {
        new: true,
      },
    );
  }

  async saveAJobProduct(jobProductDocument: JobProductDocument) {
    await jobProductDocument.save();
  }
}
