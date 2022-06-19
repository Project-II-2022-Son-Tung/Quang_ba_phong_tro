/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/ban-types */
import { startSession } from 'mongoose';
import FormData from 'form-data';
import axios from 'axios';
import { OrderRepository } from './order.repository';
import { OrderDocument, OrderModel } from './order.model';
import { OfferRepository } from '../Offer/offer.repository';
import { ProductModel } from '../product/product.model';
import { OrderType } from './order-type';
import { OfferModel } from '../Offer/offer.model';
import { OrderComplainModel } from './order-complain.model';
import { WalletModel } from '../wallet/wallet.model';
import { TransactionDirection } from '../transaction/transaction-direction';
import { InternalTransModel } from '../transaction/internalTrans.model';
import agenda from '../agenda';

export class OrderService {
  private readonly orderRepository = new OrderRepository();

  private readonly offerRepository = new OfferRepository();

  async acceptOfferToOrder(
    user_id: string,
    offer_id: string,
    note: string,
  ): Promise<OrderDocument> {
    const offer = await this.offerRepository.getOfferById(offer_id);
    const job = await ProductModel.findById(offer.job_id);
    if (!job || job.status === 2) throw new Error('Job not found');
    if (!offer || offer.status !== 0 || user_id !== job.user_id.toString())
      throw new Error('Offer not found or you do not have permision to accept');
    const order = await this.orderRepository.getOrderByJobId(
      job._id.toString(),
    );
    if (order) throw new Error('Order already exists');
    const session = await startSession();
    session.startTransaction();
    try {
      const newOrder = await OrderModel.create(
        [
          {
            product_id: job._id.toString(),
            client_id: user_id,
            provider_id: offer.provider_id.toString(),
            type: OrderType.Job,
            price: offer.offer_price,
            note,
            estimated_time: offer.offer_finish_estimated_time,
          },
        ],
        { session },
      );
      await OfferModel.findByIdAndUpdate(offer_id, { status: 1 }, { session });
      await OfferModel.updateMany(
        { job_id: job._id.toString(), status: 0 },
        { status: 2 },
        { session },
      );
      await session.commitTransaction();
      session.endSession();
      const returnObject = (await OrderModel.findById(
        newOrder[0]._id.toString(),
      ).lean()) as OrderDocument;
      return returnObject;
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      throw err;
    }
  }

  async getOrderById(
    user_type: string,
    user_id: string,
    order_id: string,
  ): Promise<OrderDocument | null> {
    const currentOrder = await this.orderRepository.getOrderById(order_id);
    if (!currentOrder) throw new Error('Order not found');
    if (user_type === 'client') {
      if (
        currentOrder.client_id.toString() === user_id ||
        currentOrder.provider_id.toString() === user_id
      ) {
        return currentOrder;
      }
      throw new Error('You do not have permision to get this order');
    }
    return currentOrder;
  }

  async getMyOrders(
    user_id: string,
    role: string,
    page: number,
    limit: number,
    select: string,
    status: string,
  ): Promise<OrderDocument[]> {
    const selectQuery = {};
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        selectQuery[value] = 1;
      });
    }
    if (role === 'client') {
      selectQuery['client_id'] = 0;
      if (status)
        return this.orderRepository.getOrdersWithProviderPopulate(
          page,
          limit,
          {
            client_id: user_id,
            status: { $in: status.split(',').map((x) => +x) },
          },
          selectQuery,
        );
      return this.orderRepository.getOrdersWithProviderPopulate(
        page,
        limit,
        { client_id: user_id },
        selectQuery,
      );
    } else if (role === 'provider') {
      selectQuery['provider_id'] = 0;
      if (status)
        return this.orderRepository.getOrdersWithClientPopulate(
          page,
          limit,
          {
            provider_id: user_id,
            status: { $in: status.split(',').map((x) => +x) },
          },
          selectQuery,
        );
      return this.orderRepository.getOrdersWithClientPopulate(
        page,
        limit,
        { provider_id: user_id },
        selectQuery,
      );
    }
    throw new Error(
      'You did not specify role or do not have permision to get this order',
    );
  }

  async cancelOrder(
    user_type: string,
    user_id: string,
    order_id: string,
    cancelNote: string,
  ): Promise<OrderDocument> {
    const currentOrder = await this.orderRepository.getOrderById(order_id);
    if (!currentOrder) throw new Error('Order not found');
    const newCancelNote = `${cancelNote} (by ${user_type} ${user_id})`;
    if (user_type === 'admin') {
      if (currentOrder.status !== 0 && currentOrder.status !== 1)
        throw new Error('Order is not in pending or confirmed');
      const jobs = await agenda.jobs({
        name: 'auto complete order',
        data: order_id,
      });
      if (jobs.length > 0) {
        jobs[0].remove();
      }
      const session = await startSession();
      session.startTransaction();
      try {
        const newOrder = await OrderModel.findByIdAndUpdate(
          order_id,
          { status: 7, cancel_note: newCancelNote },
          { session, new: true },
        );
        await session.commitTransaction();
        session.endSession();
        return newOrder;
      } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
      }
    }
    if (user_type === 'client') {
      if (currentOrder.client_id.toString() === user_id) {
        if (currentOrder.status !== 0)
          throw new Error('Order is not in pending');
        const session = await startSession();
        session.startTransaction();
        try {
          const newOrder = await OrderModel.findByIdAndUpdate(
            order_id,
            { status: 5, cancel_note: newCancelNote },
            { session, new: true },
          );
          await session.commitTransaction();
          session.endSession();
          return newOrder;
        } catch (err) {
          await session.abortTransaction();
          await session.endSession();
          throw err;
        }
      }
      if (currentOrder.provider_id.toString() === user_id) {
        if (currentOrder.status !== 0 && currentOrder.status !== 1)
          throw new Error('Order is not in pending or confirmed');
        const jobs = await agenda.jobs({
          name: 'auto complete order',
          data: order_id,
        });
        if (jobs.length > 0) {
          jobs[0].remove();
        }
        const session = await startSession();
        session.startTransaction();
        try {
          const newOrder = await OrderModel.findByIdAndUpdate(
            order_id,
            { status: 6, cancel_note: newCancelNote },
            { session, new: true },
          );
          await session.commitTransaction();
          session.endSession();
          return newOrder;
        } catch (err) {
          await session.abortTransaction();
          await session.endSession();
          throw err;
        }
      }
      throw new Error('You do not have permision to cancel this order');
    }
    throw new Error('You do not have permision to cancel this order');
  }

  async confirmOrder(
    user_type: string,
    user_id: string,
    order_id: string,
  ): Promise<OrderDocument> {
    const currentOrder = await this.orderRepository.getOrderById(order_id);
    if (!currentOrder) throw new Error('Order not found');
    if (currentOrder.status !== 0) throw new Error('Order is not in pending');
    if (user_type === 'admin') {
      await agenda.schedule('in 72 hours', 'auto complete order', order_id);
      return this.orderRepository.updateOrderStatus(order_id, 1);
    }
    if (user_type === 'client') {
      if (currentOrder.provider_id.toString() === user_id) {
        await agenda.schedule('in 72 hours', 'auto complete order', order_id);
        return this.orderRepository.updateOrderStatus(order_id, 1);
      }
      throw new Error('You do not have permision to confirm this order');
    }
    throw new Error('You do not have permision to confirm this order');
  }

  async completeOrder(
    user_type: string,
    user_id: string,
    order_id: string,
  ): Promise<OrderDocument> {
    const currentOrder = await this.orderRepository.getOrderById(order_id);
    if (!currentOrder) throw new Error('Order not found');
    if (currentOrder.status !== 1) throw new Error('Order is not in confirmed');
    if (user_type === 'admin') {
      const session = await startSession();
      session.startTransaction();
      try {
        const amount = currentOrder.price;
        const fee = Math.round(amount * parseFloat(process.env.FEE_AMOUNT));
        await OrderModel.findByIdAndUpdate(
          currentOrder._id,
          {
            status: 2,
          },
          { session, new: true },
        );
        const fromWallet = await WalletModel.findOneAndUpdate(
          { user_id: currentOrder.client_id.toString() },
          { $inc: { available_balance: -amount } },
          { new: true, session },
        );
        if (!fromWallet) throw new Error('CLient Wallet not found');
        const newTransaction = await InternalTransModel.create(
          [
            {
              wallet_id: fromWallet._id,
              ammount: amount,
              direction: TransactionDirection.OUT,
              fee,
              order_id,
              content: `Thanh toan don hang ${order_id} voi so Bi: ${amount} - Phi giao dich: ${fee} Bi. Thoi gian: ${new Date()}`,
            },
          ],
          { session },
        );
        if (!newTransaction) throw new Error('Transaction not created');
        const newOrder = await OrderModel.findByIdAndUpdate(
          order_id,
          { status: 3 },
          { session, new: true },
        );
        if (!newOrder) throw new Error('Order not updated');
        await session.commitTransaction();
        session.endSession();
        const jobs = await agenda.jobs({
          name: 'auto complete order',
          data: order_id,
        });
        if (jobs.length > 0) {
          jobs[0].remove();
        }
        return newOrder;
      } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
      }
    }
    if (user_type === 'client') {
      if (currentOrder.client_id.toString() === user_id) {
        const session = await startSession();
        session.startTransaction();
        try {
          const amount = currentOrder.price;
          const fee = Math.round(amount * parseFloat(process.env.FEE_AMOUNT));
          await OrderModel.findByIdAndUpdate(
            currentOrder._id,
            {
              status: 2,
            },
            { session, new: true },
          );
          const fromWallet = await WalletModel.findOneAndUpdate(
            { user_id },
            { $inc: { available_balance: -amount } },
            { new: true, session },
          );
          if (!fromWallet) throw new Error('CLient Wallet not found');
          const newTransaction = await InternalTransModel.create(
            [
              {
                wallet_id: fromWallet._id,
                ammount: amount,
                direction: TransactionDirection.OUT,
                fee,
                order_id,
                content: `Thanh toan don hang ${order_id} voi so Bi: ${amount} - Phi giao dich: ${fee} Bi. Thoi gian: ${new Date()}`,
              },
            ],
            { session },
          );
          if (!newTransaction) throw new Error('Transaction not created');
          const newOrder = await OrderModel.findByIdAndUpdate(
            order_id,
            { status: 3 },
            { session, new: true },
          );
          if (!newOrder) throw new Error('Order not updated');
          await session.commitTransaction();
          session.endSession();
          const jobs = await agenda.jobs({
            name: 'auto complete order',
            data: order_id,
          });
          if (jobs.length > 0) {
            jobs[0].remove();
          }
          return newOrder;
        } catch (err) {
          await session.abortTransaction();
          await session.endSession();
          throw err;
        }
      }
      throw new Error('You do not have permision to complete this order');
    }
    throw new Error('You do not have permision to complete this order');
  }

  async complainOrder(
    user_type: string,
    user_id: string,
    order_id: string,
    complain: string,
    images: Express.Multer.File[],
  ): Promise<OrderDocument> {
    const currentOrder = await this.orderRepository.getOrderById(order_id);
    if (!currentOrder) throw new Error('Order not found');
    if (currentOrder.status !== 1) throw new Error('Order is not in confirmed');
    if (user_type === 'admin') {
      return this.orderRepository.updateOrderStatus(order_id, 4);
    }
    if (user_type === 'client') {
      if (currentOrder.client_id.toString() === user_id) {
        const session = await startSession();
        session.startTransaction();
        try {
          const form = new FormData();
          const imagesrcs = [];
          images.forEach(async (image) => {
            form.append('images', image.buffer);
          });
          const mediaResponse = await axios.post<string>(
            `${process.env.MEDIA_ROOT_URL}/file`,
            form,
            {
              headers: { ...form.getHeaders() },
            },
          );
          imagesrcs.push(mediaResponse.data);
          await OrderComplainModel.create(
            [
              {
                order_id,
                client_id: user_id,
                complain,
                images: imagesrcs,
              },
            ],
            { session },
          );
          const newOrder = await OrderModel.findByIdAndUpdate(
            order_id,
            { status: 4 },
            { session },
          );
          await session.commitTransaction();
          session.endSession();
          return newOrder;
        } catch (err) {
          await session.abortTransaction();
          await session.endSession();
          throw err;
        }
      }
      throw new Error('You do not have permision to complain this order');
    }
    throw new Error('You do not have permision to complain this order');
  }
}

// ng bán tạo service => ng mua mua service => tạo order gồm service_Id và ng mua id
// ng mua tạo job => ng bán offer => ng mua chấp nhận => tạo order gồm job id và ng bán id
