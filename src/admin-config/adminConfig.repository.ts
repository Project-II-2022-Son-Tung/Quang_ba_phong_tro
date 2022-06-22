import { AdminConfigDocument, AdminConfigModel } from './adminConfig.model';

export class AdminConfigRepository {
  async getAdminConfig(
    query: Record<string, unknown>,
  ): Promise<AdminConfigDocument | null> {
    return AdminConfigModel.findOne(query).lean();
  }
}
