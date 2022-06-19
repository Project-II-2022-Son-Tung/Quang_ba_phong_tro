import Agenda from 'agenda';
import { startSession } from 'mongoose';
import { OrderModel } from './order/order.model';
import { InternalTransModel } from './transaction/internalTrans.model';
import { TransactionDirection } from './transaction/transaction-direction';
import { WalletModel } from './wallet/wallet.model';

const agenda = new Agenda({ db: { address: process.env.MONGODB_CONN_STRING } });
agenda.define('auto complete order', async (job, done) => {
  const order_id = job.attrs.data;
  console.log(`auto complete order ${order_id}`);
  const currentOrder = await OrderModel.findOne({ _id: order_id });
  if (!currentOrder) throw new Error('Order not found');
  if (currentOrder.status !== 1) throw new Error('Order is not in confirmed');
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
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
  done();
});

export default agenda;
