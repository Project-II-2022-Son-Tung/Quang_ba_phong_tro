import { UserModelUnselectableFields } from '../user/user.model';
import { ClientDocument } from './client.model';
import { ClientRepository } from './client.repository';

export class ClientService {
  private readonly clientRepository = new ClientRepository();

  async getClientList(
    page: number,
    limit: number,
    category: string,
    select: string,
  ) {
    const query = {};
    const selectQuery = {};
    let populateCategory = false;
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
  async getClientDetailById(client_id: string) {
    return this.clientRepository.getClientDetailById(client_id);
  }
}
