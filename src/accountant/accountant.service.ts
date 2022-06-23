/* eslint-disable dot-notation */
import { UserStatus } from '../user/enums/user-status.enum';
import { UserModelUnselectableFields } from '../user/user.model';
import { AccountantDocument } from './accountant.model';
import { AccountantRepository } from './accountant.repository';
import { ChangeAccountantProfileDto } from './dtos/changeAccountantProfile.dto';

export class AccountantService {
  private readonly accountantRepository = new AccountantRepository();

  async getAccountantList(page: number, limit: number, select: string) {
    const query = { del_flag: false, status: UserStatus.ACTIVE };
    const selectQuery: {
      category?: number;
      [query: string]: number;
    } = {};
    let populateCategory = false;
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        if (!UserModelUnselectableFields.includes(value))
          selectQuery[value] = 1;
      });
      populateCategory = selectQuery['category'] === 1;
    }
    const total = await this.accountantRepository.getAccountantNumberWithFilter(
      query,
    );
    let data: AccountantDocument[];
    if (populateCategory)
      data =
        await this.accountantRepository.getAccountantListWithCategoryPopulate(
          page,
          limit,
          query,
          selectQuery,
        );
    else {
      data = await this.accountantRepository.getAccountantListWithNoPopulate(
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

  async getAccountantDetailById(accountant_id: string) {
    const query = {
      _id: accountant_id,
      del_flag: false,
    };
    return this.accountantRepository.getAccountantDetailById(query);
  }

  async changeAccountantProfile(
    accountant_id: string,
    changeAccountantProfileDto: ChangeAccountantProfileDto,
  ) {
    const query = {
      _id: accountant_id,
      del_flag: false,
    };
    return this.accountantRepository.findAndUpdateAccountantDetailById(
      query,
      changeAccountantProfileDto,
    );
  }
}
