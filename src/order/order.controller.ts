import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  ForbiddenError,
  Get,
  InternalServerError,
  JsonController,
  Param,
  Post,
  QueryParam,
  UploadedFiles,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { fileUploadOptions } from '../config/multer';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
import { OrderService } from './order.service';

@JsonController('/orderJob')
export class OrderController {
  private readonly orderService = new OrderService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'accept an offer to order',
  })
  @Authorized(['client'])
  @Post('/:jobOfferId', { transformResponse: false })
  async orderJobByOffer(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobOfferId') job_offer_id: string,
    @Body() body,
  ) {
    try {
      const result = await this.orderService.acceptOfferToOrder(
        user._id,
        job_offer_id,
        body.note,
      );
      if (result) return result;
      throw new InternalServerError('Accept offer to order failed');
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get an order by id',
  })
  @Authorized(['admin', 'client'])
  @Get('/:jobOrderId', { transformResponse: false })
  async getOrderById(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobOrderId') job_order_id: string,
  ) {
    try {
      return this.orderService.getOrderById(user.type, user._id, job_order_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get all my orders',
  })
  @Authorized(['client'])
  @Get('/', { transformResponse: false })
  async getMyOrders(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('select')
    select: string,
    @QueryParam('role')
    role: string,
    @QueryParam('status')
    status: string,
  ) {
    try {
      if (!page || !limit) return null;
      return this.orderService.getMyOrders(
        user._id,
        role,
        page,
        limit,
        select,
        status,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'cancel an order',
  })
  @Authorized(['admin', 'client'])
  @Post('/cancel/:jobOrderId', { transformResponse: false })
  async cancelOrder(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobOrderId') job_order_id: string,
    @Body() body,
  ) {
    try {
      return this.orderService.cancelOrder(
        user.type,
        user._id,
        job_order_id,
        body.cancel_note,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'confirm an order',
  })
  @Authorized(['admin', 'client'])
  @Post('/confirm/:jobOrderId', { transformResponse: false })
  async confirmOrder(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobOrderId') job_order_id: string,
  ) {
    try {
      return this.orderService.confirmOrder(user.type, user._id, job_order_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'complete an order',
  })
  @Authorized(['admin', 'client'])
  @Post('/complete/:jobOrderId', { transformResponse: false })
  async completeOrder(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobOrderId') job_order_id: string,
  ) {
    try {
      return this.orderService.completeOrder(user.type, user._id, job_order_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'complain an order',
  })
  @Authorized(['admin', 'client'])
  @Post('/complain/:jobOrderId', { transformResponse: false })
  async complainOrder(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobOrderId') job_order_id: string,
    @Body() body,
    @UploadedFiles('images', { options: fileUploadOptions, required: false })
    images: Express.Multer.File[],
  ) {
    try {
      console.log(images);
      console.log(body);
      return;
      // return this.orderService.complainOrder(
      //   user.type,
      //   user._id,
      //   job_order_id,
      //   body.note,
      //   images,
      // );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
