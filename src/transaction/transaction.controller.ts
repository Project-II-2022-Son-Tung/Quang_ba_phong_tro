import {
  Authorized,
  BadRequestError,
  CurrentUser,
  ForbiddenError,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
import { TransactionService } from './transaction.service';

@JsonController('/transaction')
export class TransactionController {
  private readonly transactionService = new TransactionService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get internal transactions',
  })
  @Authorized(['client'])
  @Get('/internal', { transformResponse: false })
  async getInternalTransactions(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('select') select: string,
  ) {
    try {
      return this.transactionService.getInternalTransactions(
        user._id,
        page,
        limit,
        select,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get external transactions',
  })
  @Authorized(['client'])
  @Get('/external', { transformResponse: false })
  async getExternalTransactions(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('select') select: string,
  ) {
    try {
      return this.transactionService.getExternalTransactions(
        user._id,
        page,
        limit,
        select,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get all transactions',
  })
  @Authorized(['admin'])
  @Get('/', { transformResponse: false })
  async getTransactions(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('select') select: string,
  ) {
    try {
      return this.transactionService.getTransactions(
        user.type,
        page,
        limit,
        select,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get a transaction by id',
  })
  @Authorized(['admin','client'])
  @Get('/:transactionId', { transformResponse: false })
  async getTransactionById(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('transactionId') transaction_id: string,
  ) {
    try {
      return this.transactionService.getTransactionById(
        user.type,
        user._id,
        transaction_id,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get transactions by order id',
  })
  @Authorized(['admin','client'])
  @Get('/order/:orderId', { transformResponse: false })
  async getTransactionsByOrderId(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('orderId') order_id: string,
  ) {
    try {
      return this.transactionService.getTransactionsByOrderId(
        user.type,
        user._id,
        order_id,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'accept a transaction',
  })
  @Authorized(['admin'])
  @Post('/accept/:transactionId', { transformResponse: false })
  async acceptTransaction(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('transactionId') transaction_id: string,
  ) {
    try {
      return this.transactionService.acceptTransaction(
        user.type,
        user._id,
        transaction_id,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
