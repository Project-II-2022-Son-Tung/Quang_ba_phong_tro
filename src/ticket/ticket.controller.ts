import {
  Body,
  JsonController,
  Get,
  BadRequestError,
  NotFoundError,
  Authorized,
  QueryParam,
  CurrentUser,
  Param,
  Patch,
  Post,
  UploadedFile,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateTicketDto } from './dtos/createTicket.dto';
import { TicketService } from './ticket.service';
import { fileUploadOptions } from '../config/multer';
import { CreateTicketMessageDto } from './dtos/createTicketMessage.dto';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';

@JsonController('/tickets')
export class TicketController {
  private readonly ticketService = new TicketService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get owned Ticket list with filter',
  })
  @Authorized(['admin', 'client'])
  @Get('', { transformResponse: false })
  async getTicketList(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('ticketID')
    ticket_id: string,
    @QueryParam('type')
    type: string,
    @QueryParam('status')
    status: string,
    @QueryParam('fields')
    fields: string,
  ) {
    try {
      if (!page || !limit)
        throw new BadRequestError(
          'The page and limit must be specified and must be a valid number',
        );
      return this.ticketService.getTicketList(
        user,
        ticket_id,
        type,
        status,
        fields,
        page,
        limit,
      );
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create a Ticket',
  })
  @Authorized(['client'])
  @Post('', { transformResponse: false })
  async createTicket(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFile('attachment', { options: fileUploadOptions, required: false })
    attachment: Express.Multer.File,
  ) {
    try {
      return this.ticketService.createTicket(
        user._id,
        createTicketDto,
        attachment,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get information of a Ticket',
  })
  @Authorized(['admin', 'client'])
  @Get('/:id', { transformResponse: false })
  async getTicketByID(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('id') ticket_id: string,
  ) {
    try {
      return this.ticketService.getTicketDetails(user, ticket_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get attachment of a Ticket',
  })
  @Authorized(['admin', 'client'])
  @Get('/attachment/:id', { transformResponse: false })
  async getTicketAttachmentByID(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('id') ticket_id: string,
  ) {
    try {
      return this.ticketService.getTicketAttachmentByID(user, ticket_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Close Ticket',
  })
  @Authorized(['admin', 'client'])
  @Patch('/close/:id', { transformResponse: false })
  async closeTicketByID(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('id') ticket_id: string,
  ) {
    try {
      const updatedTicket = await this.ticketService.closeTicketByID(
        user,
        ticket_id,
      );
      if (!updatedTicket)
        throw new BadRequestError('Cannot close this ticket !');
      return {
        Message: 'Closed successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create a Ticket Message',
  })
  @Authorized(['admin', 'client'])
  @Post('/message/create', { transformResponse: false })
  async createTicketMessage(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Body() createTicketMessageDto: CreateTicketMessageDto,
    @UploadedFile('attachment', { options: fileUploadOptions, required: false })
    attachment: Express.Multer.File,
  ) {
    try {
      return this.ticketService.createTicketMessage(
        user,
        createTicketMessageDto,
        attachment,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get list message by ticket ID',
  })
  @Authorized(['admin', 'client'])
  @Get('/message/:id', { transformResponse: false })
  async getTicketMessagesList(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('id') ticket_id: string,
  ) {
    try {
      return this.ticketService.getTicketMessagesList(user, ticket_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
