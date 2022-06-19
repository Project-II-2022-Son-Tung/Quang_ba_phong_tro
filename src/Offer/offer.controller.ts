/* eslint-disable prettier/prettier */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  ForbiddenError,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParam,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
import { CreateOfferDto } from './dtos/CreateOffer.dto';
import { UpdateOfferDto } from './dtos/UpdateOffer.dto';
import { OfferService } from './offer.service';

@JsonController('/offers')
export class OfferController {
  private readonly offerService = new OfferService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Offer list with jobId',
  })
  @Authorized(['admin', 'client'])
  @Get('/:jobId', { transformResponse: false })
  async getOfferList(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @Param('jobId')
    jobId: string,
    @QueryParam('select')
    select: string,
  ) {
    try {
      if (!page || !limit) return null;
      return this.offerService.getOfferList(
        user._id,
        user.type,
        page,
        limit,
        jobId,
        select,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Offer list with jobId',
  })
  @Authorized(['client'])
  @Get('/:jobId/my_offer', { transformResponse: false })
  async getMyOfferWithJobId(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobId')
    jobId: string,
    @QueryParam('select')
    select: string,
  ) {
    try {
      return this.offerService.getMyOfferByJobId(
        user._id,
        jobId,
        select,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get Offer list of client',
  })
  @Authorized(['client'])
  @Get('/', { transformResponse: false })
  async getMyOffer(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('select')
    select: string,
  ) {
    try {
      if (!page || !limit) return null;
      return this.offerService.getMyOffer(
        user._id,
        page,
        limit,
        select,
      );
    }
    catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Update my offer of a job',
  })
  @Authorized(['client'])
  @Patch('/:jobId/', { transformResponse: false })
  async UpdateMyOffer(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobId')
    jobId: string,
    @Body() updateOfferDto: UpdateOfferDto
  ) {
    try {
      return this.offerService.updateMyOffer(
        user._id,
        jobId,
        updateOfferDto,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create my offer of a job',
  })
  @Authorized(['client'])
  @Post('/:jobId/', { transformResponse: false })
  async CreateMyOffer(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobId')
    jobId: string,
    @Body() createOfferDto: CreateOfferDto
  ) {
    try {
      return this.offerService.createOffer(
        user._id,
        jobId,
        createOfferDto,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'delete my offer',
  })
  @Authorized(['client'])
  @Delete('/:jobId/', { transformResponse: false })
  async deleteMyOffer(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('jobId')
    jobId: string,
  ) {
    try {
      return this.offerService.deleteMyOffer(
        user._id,
        jobId,
      );
    } catch (e) {
      if (e instanceof ForbiddenError) throw new ForbiddenError(e.message);
      throw new BadRequestError(e.message);
    }
  }

}
