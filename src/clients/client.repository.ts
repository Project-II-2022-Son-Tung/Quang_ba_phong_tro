import { ClientDocument, ClientModel } from './client.model';

export class ClientRepository {
  async getClientListWithCategoryPopulate(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
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
    query: {},
    selectQuery: {},
  ): Promise<ClientDocument[] | null> {
    return ClientModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getClientNumberWithFilter(query: {}): Promise<number> {
    return ClientModel.countDocuments(query);
  }
  async getClientDetailById(client_id: string) {
    return ClientModel.findById(client_id)
      .populate({ path: 'category', select: '-description' })
      .lean();
  }
}
