/* eslint-disable @typescript-eslint/ban-types */
import { Request } from 'express';
import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  ForbiddenError,
  Get,
  JsonController,
  Param,
  Patch,
  QueryParam,
  Req,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
import { DepositDto } from './dtos/depositDto';
import { WalletService } from './wallet.service';

@JsonController('/wallet')
export class WalletController {
  private readonly walletService = new WalletService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get my wallet',
  })
  @Authorized(['client'])
  @Get('/my', { transformResponse: false })
  async getMyWallet(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
  ) {
    try {
      return this.walletService.getMyWallet(user.type, user._id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get a wallet by user id',
  })
  @Authorized(['admin'])
  @Get('/:userId', { transformResponse: false })
  async getWalletByUserId(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('userId') user_id: string,
  ) {
    try {
      return this.walletService.getWalletByUserId(user.type, user_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get wallets',
  })
  @Authorized(['admin'])
  @Get('/', { transformResponse: false })
  async getWallets(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('select')
    select: string,
    @QueryParam('status')
    status: string,
  ) {
    try {
      return this.walletService.getWallets(
        user.type,
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
    description: 'deposit to wallet',
  })
  @Authorized(['client'])
  @Patch('/deposit', { transformResponse: false })
  async deposit(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Body() body,
    @Req() req: Request,
  ) {
    try {
      const depositDto: DepositDto = {
        user_id: user._id,
        locale: body.locale,
        ipAddr:
          (req.headers['x-forwarded-for'] as string) ||
          req.socket.remoteAddress,
        amount: body.amount,
      };
      return this.walletService.deposit(depositDto);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'lock wallet',
  })
  @Authorized(['admin'])
  @Patch('/lock/:user_id', { transformResponse: false })
  async lock(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('user_id') user_id: string,
  ) {
    try {
      return this.walletService.lockWallet(user.type, user_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'unlock wallet',
  })
  @Authorized(['admin'])
  @Patch('/unlock/:user_id', { transformResponse: false })
  async unlock(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('user_id') user_id: string,
  ) {
    try {
      return this.walletService.unlockWallet(user.type, user_id);
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
