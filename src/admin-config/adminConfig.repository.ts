import {
  AdminConfigDocument,
  AdminConfigModel,
} from './adminConfig.model';

export class AdminConfigRepository {
  async getAdminConfig(query: {}): Promise<AdminConfigDocument | null> {
    return AdminConfigModel.findOne(query).lean();
  }
}
