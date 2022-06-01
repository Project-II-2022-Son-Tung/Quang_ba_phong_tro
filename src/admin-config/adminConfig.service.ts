import { ProductStatus } from 'src/product/product-status.enum';
import { AdminConfigRepository } from './adminConfig.repository';

export class AdminConfigService {
  private readonly adminConfigRepository = new AdminConfigRepository();
  
  async getInitialCreateProductServiceStatus(): Promise<ProductStatus> {
    const query = { name: 'initialCreateServiceProduct' };
    const adminConfig = await this.adminConfigRepository.getAdminConfig(query);
    return adminConfig.value;
  }

  async getInitialCreateJobServiceStatus(): Promise<ProductStatus> {
    const query = { name: 'initialCreateJobProduct' };
    const adminConfig = await this.adminConfigRepository.getAdminConfig(query);
    return adminConfig.value;
  }
}
