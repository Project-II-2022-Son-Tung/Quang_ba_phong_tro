/* eslint-disable dot-notation */
import { UserStatus } from '../user/user-status.enum';
import { UserModelUnselectableFields } from '../user/user.model';
import { ClientDocument } from './client.model';
import { ClientRepository } from './client.repository';

export class ClientService {
  private readonly clientRepository = new ClientRepository();

  async getClientList(
    user_type: string,
    page: number,
    limit: number,
    category: string,
    select: string,
  ) {
    const query = { del_flag: false };
    const selectQuery = {};
    let populateCategory = false;
    if (user_type==='client'){
      Object.assign(query, { status: UserStatus.ACTIVE });
    }
    if (category) Object.assign(query, { $in: { category } });
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        if (!UserModelUnselectableFields.includes(value))
          selectQuery[value] = 1;
      });
      if (selectQuery['category'] === 1) populateCategory = true;
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

  async getClientDetailById(user_type: string, client_id: string) {
    const query = {
      _id: client_id,
      del_flag: false,
    };
    if (user_type === 'client') {
      Object.assign(query, { status: UserStatus.ACTIVE });
    }
    return this.clientRepository.getClientDetailById(query);
  }
}