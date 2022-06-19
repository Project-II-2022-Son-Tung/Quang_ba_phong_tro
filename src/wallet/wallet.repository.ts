/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/ban-types */
import querystring from 'qs';
import crypto from 'crypto';
import { OrderModel } from '../order/order.model';
import { WalletStatus } from './wallet-status.enum';
import { WalletDocument, WalletModel } from './wallet.model';
import { DepositDto } from './dtos/depositDto';

export class WalletRepository {
  async getWalletByUserId(user_id: string): Promise<WalletDocument | null> {
    return WalletModel.findOne({ user_id }).lean().populate('user', 'name');
  }

  async getWallets(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<WalletDocument[]> {
    const wallets = await WalletModel.find(query)
      .select(selectQuery)
      .skip(page * limit)
      .limit(limit)
      .lean()
      .populate('user', 'name');
    return wallets as WalletDocument[];
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

  sortObject(obj: {}) {
    const sorted = {};
    const str = [];
    let key: number;
    Object.keys(obj).forEach((ikey) => {
      if (Object.prototype.hasOwnProperty.call(obj, ikey)) {
        str.push(encodeURIComponent(ikey));
      }
    });
    str.sort();
    for (key = 0; key < str.length; key += 1) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  // 👇️ format as "YYYY-MM-DD hh:mm:ss"
  // You can tweak formatting easily
  formatDate(date: Date) {
    return `${[
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('')}${[
      this.padTo2Digits(date.getHours()),
      this.padTo2Digits(date.getMinutes()),
      this.padTo2Digits(date.getSeconds()),
    ].join('')}`;
  }

  createPaymentUrl(depositDto: DepositDto) {
    const date = new Date();
    const wallet = WalletModel.findOne({ user_id: depositDto.user_id }).lean();
    const orderId = `${wallet.user_id}_${this.formatDate(date)}`;
    const orderInfo = `Nap tien vao vi tien ${wallet._id}. So tien: ${depositDto.amount}.`;
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = process.env.VNPAY_TMNCODE;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = depositDto.locale;
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 190002;
    vnp_Params['vnp_Amount'] = depositDto.amount * 100;
    vnp_Params['vnp_ReturnUrl'] = process.env.RETURN_URL;
    vnp_Params['vnp_IpAddr'] = depositDto.ipAddr;
    vnp_Params['vnp_CreateDate'] = this.formatDate(date);
    if (depositDto.bankCode !== null && depositDto.bankCode !== '') {
      vnp_Params['vnp_BankCode'] = depositDto.bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    let vnpUrl = process.env.VNPAY_URL;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', process.env.VNPHASH_SECRET_KEY);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += `?${querystring.stringify(vnp_Params, { encode: false })}`;

    console.log(vnpUrl);
    return vnpUrl;
  }
}
