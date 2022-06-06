/* eslint-disable @typescript-eslint/ban-types */
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { OrderStatus } from './order-status';
import { OrderDocument, OrderModel } from './order.model';

export class OrderRepository {
  async getOrdersNoPopulate(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<OrderDocument[] | null> {
    return OrderModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getOrdersWithPopulate(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<OrderDocument[] | null> {
    return OrderModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'product_id', select: 'name description' })
      .populate({ path: 'user_id', select: 'fullname avatar' })
      .lean();
  }

  async getOrdersByUserId(
    userId: string,
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<OrderDocument[] | null> {
    return OrderModel.find({ user_id: userId, ...query })
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'product_id', select: 'name description' })
      .lean();
  }

  async getNumberOfOrdersByProductId(productId: string): Promise<number> {
    return OrderModel.countDocuments({ product_id: productId });
  }

  async getOrderById(id: string): Promise<OrderDocument | null> {
    return OrderModel.findById(id).lean();
  }

  async getOrderStatusById(id: string): Promise<OrderStatus | null> {
    const order = await OrderModel.findById(id).lean();
    if (order) {
      return order.status;
    }
    return null;
  }

  async createOrder(order: CreateOrderDto): Promise<OrderDocument | null> {
    return OrderModel.create(order);
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderDocument | null> {
    return OrderModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }

  async deleteOrder(id: string): Promise<OrderDocument | null> {
    return OrderModel.findByIdAndDelete(id).lean();
  }
}
