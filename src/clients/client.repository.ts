import { ClientDocument, ClientModel } from './client.model';

export class ClientRepository {
  async getClientListWithCategoryPopulate(
    page: number,
    limit: number,
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
  ): Promise<ClientDocument[] | null> {
    return ClientModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'category', select: '-description' })
      .lean();
  }

  async getClientListWithNoPopulate(
    page: number,
    limit: number,
    query: Record<string, unknown>,
    selectQuery: Record<string, unknown>,
  ): Promise<ClientDocument[] | null> {
    return ClientModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getClientNumberWithFilter(
    query: Record<string, unknown>,
  ): Promise<number> {
    return ClientModel.countDocuments(query);
  }

  async getClientDetailById(query: Record<string, unknown>) {
    return ClientModel.findOne(query)
      .populate({ path: 'category', select: '-description' })
      .lean();
  }
}
