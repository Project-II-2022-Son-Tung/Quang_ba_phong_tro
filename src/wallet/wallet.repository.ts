import { WalletStatus } from './wallet-status.enum';
import { WalletDocument, WalletModel } from './wallet.model';

export class WalletRepository {
  async getWalletByUserId(user_id: string): Promise<WalletDocument | null> {
    return WalletModel.findOne({ user_id }).lean().populate('user', 'name');
  }

  async checkWalletAvailableBalance(
    user_id: string,
    amount: number,
  ): Promise<boolean> {
    const wallet = await WalletModel.findOne({ user_id });
    if (wallet.available_balance < amount) {
      return false;
    }
    return true;
  }

  async checkWalletBalance(user_id: string, amount: number): Promise<boolean> {
    const wallet = await WalletModel.findOne({ user_id });
    if (wallet.balance < amount) {
      return false;
    }
    return true;
  }

  async minusWalletAvailableBalance(
    user_id: string,
    amount: number,
  ): Promise<[WalletDocument, string]> {
    const available = await this.checkWalletAvailableBalance(user_id, amount);
    if (!available) {
      return [null, 'not enough available balance'];
    }
    try {
      const wallet = await WalletModel.findOneAndUpdate(
        { user_id },
        { $inc: { available_balance: -amount } },
        { new: true },
      );
      return [wallet, ''];
    } catch (err) {
      return [null, err.message];
    }
  }

  async plusWalletAvailableBalance(
    user_id: string,
    amount: number,
  ): Promise<[WalletDocument, string]> {
    try {
      const wallet = await WalletModel.findOneAndUpdate(
        { user_id },
        { $inc: { available_balance: amount } },
        { new: true },
      );
      return [wallet, ''];
    } catch (err) {
      return [null, err.message];
    }
  }

  async plusWalletBalance(
    user_id: string,
    amount: number,
  ): Promise<[WalletDocument, string]> {
    try {
      const wallet = await WalletModel.findOneAndUpdate(
        { user_id },
        { $inc: { balance: amount } },
        { new: true },
      );
      return [wallet, ''];
    } catch (err) {
      return [null, err.message];
    }
  }

  async minusWalletBalance(
    user_id: string,
    amount: number,
  ): Promise<[WalletDocument, string]> {
    const available = await this.checkWalletBalance(user_id, amount);
    if (!available) {
      return [null, 'not enough balance'];
    }
    try {
      const wallet = await WalletModel.findOneAndUpdate(
        { user_id },
        { $inc: { balance: -amount } },
        { new: true },
      );
      return [wallet, ''];
    } catch (err) {
      return [null, err.message];
    }
  }

  async checkWalletStatus(user_id: string): Promise<number> {
    const wallet = await WalletModel.findOne({ user_id });
    return wallet.status;
  }

  async changeWalletStatus(
    user_id: string,
    newStatus: WalletStatus,
  ): Promise<[WalletDocument, string]> {
    try {
      const wallet = await WalletModel.findOneAndUpdate(
        { user_id },
        { $set: { status: newStatus } },
        { new: true },
      );
      return [wallet, ''];
    } catch (err) {
      return [null, err.message];
    }
  }
}
