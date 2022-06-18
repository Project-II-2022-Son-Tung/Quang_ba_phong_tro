/* eslint-disable @typescript-eslint/ban-types */
import { DepositDto } from './dtos/depositDto';
import { WalletResponseDto } from './dtos/walletResponse.dto';
import { WalletDocument } from './wallet.model';
import { WalletRepository } from './wallet.repository';

export class WalletService {
  private readonly walletRepository = new WalletRepository();

  async getWalletByUserId(
    user_type: string,
    user_id: string,
  ): Promise<WalletDocument> {
    if (user_type === 'admin') {
      return this.walletRepository.getWalletByUserId(user_id);
    }
    throw new Error('you do not have permission to view this wallet');
  }

  async getMyWallet(
    user_type: string,
    user_id: string,
  ): Promise<WalletDocument> {
    if (user_type === 'client') {
      return this.walletRepository.getWalletByUserId(user_id);
    }
    throw new Error('you are admin, you can not view your wallet');
  }

  async getWallets(
    user_type: string,
    page: number,
    limit: number,
    select: string,
    status: string,
  ): Promise<WalletDocument[]> {
    if (user_type === 'admin') {
      const selectQuery = {};
      if (select) {
        const fieldsArray = select.split(',');
        fieldsArray.forEach((value) => {
          selectQuery[value] = 1;
        });
      }
      if (status) {
        return this.walletRepository.getWallets(
          page,
          limit,
          { status: { $in: status.split(',').map((x) => +x) } },
          selectQuery,
        );
      }
      return this.walletRepository.getWallets(page, limit, {}, selectQuery);
    }
    throw new Error('you do not have permission to view other wallets');
  }

  async deposit(depositDto: DepositDto): Promise<WalletResponseDto> {
    const wallet = await this.walletRepository.getWalletByUserId(
      depositDto.user_id,
    );
    if (!wallet) {
      return {
        success: false,
        message: 'wallet not found',
      };
    }
    if (wallet.status === 0)
      return {
        success: false,
        message: 'wallet is not actived',
      };
    if (wallet.status === 2)
      return {
        success: false,
        message: 'wallet is blocked',
      };
    return {
      success: true,
      message: this.walletRepository.createPaymentUrl(depositDto),
    };
  }

  async lockWallet(
    user_type: string,
    user_id: string,
  ): Promise<WalletDocument> {
    if (user_type !== 'admin') {
      throw new Error('you do not have permission to lock wallet');
    }
    const wallet = await this.walletRepository.getWalletByUserId(user_id);
    if (!wallet) {
      throw new Error('wallet not found');
    }
    const [newWallet, errors] = await this.walletRepository.changeWalletStatus(
      user_id,
      2,
    );
    if (errors) {
      throw new Error(errors);
    }
    return newWallet;
  }

  async unlockWallet(
    user_type: string,
    user_id: string,
  ): Promise<WalletDocument> {
    if (user_type !== 'admin') {
      throw new Error('you do not have permission to unlock wallet');
    }
    const wallet = await this.walletRepository.getWalletByUserId(user_id);
    if (!wallet) {
      throw new Error('wallet not found');
    }
    const [newWallet, errors] = await this.walletRepository.changeWalletStatus(
      user_id,
      1,
    );
    if (errors) {
      throw new Error(errors);
    }
    return newWallet;
  }

}
