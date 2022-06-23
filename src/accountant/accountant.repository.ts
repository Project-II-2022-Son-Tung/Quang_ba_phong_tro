import { UpdateQuery } from 'mongoose';
import { AccountantDocument, AccountantModel } from './accountant.model';

export class AccountantRepository {
  async getAccountantListWithCategoryPopulate(
    page: number,
    limit: number,
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
  ): Promise<AccountantDocument[] | null> {
    return AccountantModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getAccountantListWithNoPopulate(
    page: number,
    limit: number,
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
  ): Promise<AccountantDocument[] | null> {
    return AccountantModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getAccountantNumberWithFilter(
    query: Record<string, unknown>,
  ): Promise<number> {
    return AccountantModel.countDocuments(query);
  }

  async getAccountantDetailById(query: Record<string, unknown>) {
    return AccountantModel.findOne(query).lean();
  }

  async findAndUpdateAccountantDetailById(
    query: Record<string, unknown>,
    updateOptions: UpdateQuery<AccountantDocument>,
  ) {
    return AccountantModel.findOneAndUpdate(query, updateOptions, {
      new: true,
    }).lean();
  }
}
