import { BadRequestError, NotFoundError } from 'routing-controllers';
import { Aggregate, FilterQuery, PopulateOptions, Types, UpdateQuery } from 'mongoose';
import { TicketDocument, TicketModel } from './ticket.model';
import { CreateTicketDto } from './dtos/createTicket.dto';
import { CreateTicketMessageDto } from './dtos/createTicketMessage.dto';
import { createTicketQueue } from './queues/createTicket/createTicket.queue';
import { createTicketMessageQueue } from './queues/createTicketMessage/createTicketMessage.queue';
import { Ticket_MessageModel } from '../ticket-message/ticket-message.model';

export class TicketRepository {
  async getTicketsList(
    query: FilterQuery<TicketDocument>,
    selectQuery: {},
    page: number,
    limit: number,
  ) {
    return TicketModel.find(query)
      .find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getNumberOfTicketWithFilter(query: {}): Promise<number> {
    return TicketModel.countDocuments(query);
  }

  async createTicket(
    user_id: string,
    createTicketDto: CreateTicketDto,
    attachment: Express.Multer.File,
  ) {
    const job = await createTicketQueue.add({
      ...createTicketDto,
      user: new Types.ObjectId(user_id),
      attachment,
    });
    const result = await job.finished();
    if (result.httpCode) {
      if (result.httpCode === 404) throw new NotFoundError(result.message);
      throw new BadRequestError(result.message);
    }
    return result;
  }

  async getTicketDetails(
    query: FilterQuery<TicketDocument>,
  ): Promise<TicketDocument> {
    const result = await TicketModel.findOne(query);
    if (!result) {
      throw new NotFoundError('The ticket does not exist ! ');
    }
    return result;
  }

  async updateTicket(query: FilterQuery<TicketDocument>,updateOptions:UpdateQuery<TicketDocument>) {
    return TicketModel.findOneAndUpdate(query,updateOptions);
  }

  async createTicketMessage(
    author_id: string,
    createTicketMessageDto: CreateTicketMessageDto,
    attachment: Express.Multer.File,
  ) {
    const job = await createTicketMessageQueue.add({
      ...createTicketMessageDto,
      user: new Types.ObjectId(author_id),
      attachment,
    });
    const result = await job.finished();
    if (result.httpCode) {
      if (result.httpCode === 404) throw new NotFoundError(result.message);
      throw new BadRequestError(result.message);
    }
    return result;
  }

  async getTicketMessages(
    query: FilterQuery<TicketDocument>,
    populateQuery: PopulateOptions[],
    selectQuery: {},
  ) {
    const result = await Ticket_MessageModel.find(query)
      .select(selectQuery)
      .populate(populateQuery)
      .exec();
    return result;
  }
}
