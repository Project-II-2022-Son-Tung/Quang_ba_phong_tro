import { TicketRepository } from './ticket.repository';
import { TicketDocument } from './ticket.model';
import { CreateTicketDto } from './dtos/createTicket.dto';
import { CreateTicketMessageDto } from './dtos/createTicketMessage.dto';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
import { TicketStatus } from './ticket-status.enum';

export class TicketService {
  private readonly ticketRepository = new TicketRepository();

  async getTicketList(
    user: CurrentUserOnRedisDocument,
    ticket_id: string,
    type: string,
    status: string,
    select: string,
    page: number,
    limit: number,
  ) {
    const query = {};
    const selectQuery = {};
    if (user.type === 'client') {
      Object.assign(query, { user_id: user._id });
    }
    if (ticket_id) {
      Object.assign(query, {
        ticket_id: { $in: ticket_id.split(',') },
      });
    }
    if (type) {
      Object.assign(query, {
        type: { $in: type.split(',') },
      });
    }
    if (status) {
      Object.assign(query, {
        status: { $in: status.split(',') },
      });
    }
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        selectQuery[value] = 1;
      });
    }
    const total = await this.ticketRepository.getNumberOfTicketWithFilter(
      query,
    );
    const data = await this.ticketRepository.getTicketsList(
      query,
      selectQuery,
      page,
      limit,
    );
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getTicketDetails(
    user: CurrentUserOnRedisDocument,
    ticket_id: string,
  ): Promise<TicketDocument> {
    const query = { _id: ticket_id };
    if (user.type === 'client') Object.assign(query, { user_id: user._id });
    return this.ticketRepository.getTicketDetails(query);
  }

  async getTicketAttachmentByID(
    user: CurrentUserOnRedisDocument,
    ticket_id: string,
  ) {
    const ticket = await this.getTicketDetails(user, ticket_id);
    if (!ticket) return null;
    const query = { ticket_id };
    const populateQuery = []; // does not populate anything
    const selectQuery = { _id: 1, attachment: 1 };
    return this.ticketRepository.getTicketMessages(
      query,
      populateQuery,
      selectQuery,
    );
  }

  async createTicket(
    user_id: string,
    createTicketDto: CreateTicketDto,
    attachment: Express.Multer.File,
  ) {
    return this.ticketRepository.createTicket(
      user_id,
      createTicketDto,
      attachment,
    );
  }

  async closeTicketByID(user: CurrentUserOnRedisDocument, ticket_id: string) {
    const query = { _id: ticket_id, status: TicketStatus.OPEN };
    if (user.type === 'client') Object.assign(query, { user_id: user._id });
    const close_time = new Date();
    const updateOption = { status: TicketStatus.CLOSED, close_time };
    return this.ticketRepository.updateTicket(query, updateOption);
  }

  async createTicketMessage(
    user: CurrentUserOnRedisDocument,
    createTicketMessageDto: CreateTicketMessageDto,
    attachment: Express.Multer.File,
  ) {
    const query = {
      _id: createTicketMessageDto.ticket_id,
      status: TicketStatus.OPEN,
    };
    if (user.type === 'client') Object.assign(query, { user_id: user._id });
    const ticket = await this.ticketRepository.getTicketDetails(query);
    if (!ticket) return null;
    return this.ticketRepository.createTicketMessage(
      user._id,
      createTicketMessageDto,
      attachment,
    );
  }

  async getTicketMessagesList(
    user: CurrentUserOnRedisDocument,
    ticket_id: string,
  ) {
    const ticket = await this.getTicketDetails(user, ticket_id);
    if (!ticket) return null;
    const query = { ticket_id };
    const selectQuery = {};
    const populateQuery = [
      {
        path: 'user_id',
        select: {
          _id: 1,
          fullname: 1,
          avatar: 1,
        },
      },
    ];
    return this.ticketRepository.getTicketMessages(
      query,
      populateQuery,
      selectQuery,
    );
  }
}
