import { CategoryService } from '../category/category.service';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
/* eslint-disable dot-notation */
import { UserStatus } from '../user/user-status.enum';
import { UserModelUnselectableFields } from '../user/user.model';
import { ClientDocument } from './client.model';
import { ClientRepository } from './client.repository';

export class ClientService {
  private readonly clientRepository = new ClientRepository();

  private readonly categoryService = new CategoryService();

  async getClientList(
    currentUser: CurrentUserOnRedisDocument,
    page: number,
    limit: number,
    categorySlug: string,
    address: string,
    select: string,
  ) {
    const query = { del_flag: false, status: UserStatus.ACTIVE };
    const selectQuery: {
      category?: number;
      [query: string]: number;
    } = {};
    let populateCategory = false;
    if (currentUser && currentUser.type === 'admin') {
      delete query.status;
    }
    if (categorySlug) {
      const categoriesIDArray =
        await this.categoryService.getCategoriesIDBySlugString(categorySlug);
      Object.assign(query, { category: { $in: categoriesIDArray } });
    }
    if (address) Object.assign(query, { address: { $in: address.split(',') } });
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        if (!UserModelUnselectableFields.includes(value))
          selectQuery[value] = 1;
      });
      populateCategory = selectQuery['category'] === 1;
    }
    const total = await this.clientRepository.getClientNumberWithFilter(query);
    let data: ClientDocument[];
    if (populateCategory)
      data = await this.clientRepository.getClientListWithCategoryPopulate(
        page,
        limit,
        query,
        selectQuery,
      );
    else {
      data = await this.clientRepository.getClientListWithNoPopulate(
        page,
        limit,
        query,
        selectQuery,
      );
    }
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getClientDetailById(
    currentUser: CurrentUserOnRedisDocument,
    client_id: string,
  ) {
    const query = {
      _id: client_id,
      del_flag: false,
      status: UserStatus.ACTIVE,
    };
    if (currentUser && currentUser.type === 'admin') {
      delete query.status;
    }
    return this.clientRepository.getClientDetailById(query);
  }
}
