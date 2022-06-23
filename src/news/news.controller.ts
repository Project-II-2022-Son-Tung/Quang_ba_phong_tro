import {
  JsonController,
  Authorized,
  Post,
  CurrentUser,
  Body,
  Put,
  Param,
  Delete,
  BadRequestError,
  NotFoundError,
  Get,
  QueryParam,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CurrentUserOnRedisDocument } from '../user/currentUserOnRedis.interface';
import { CreateDraftDto } from './dtos/createDraft.dto';
import { CreateNewsDto } from './dtos/createNews.dto';
import { SaveDraftDto } from './dtos/saveDraft.dto';
import { UpdateNewsDto } from './dtos/updateNews.dto';
import { NewsService } from './news.service';
@JsonController('/news')
export class NewsController {
  private readonly newsService = new NewsService();

  @Get('/public', { transformResponse: false })
  @OpenAPI({
    description: 'Get public news',
  })
  async getPublicNews(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('category')
    category: string,
  ) {
    try {
      return this.newsService.getPublicNews(page, limit, category);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Get('/public/:news_id', { transformResponse: false })
  @OpenAPI({
    description: 'Get public news details',
  })
  async getPublicNewsDetails(@Param('news_id') news_id: string) {
    try {
      return this.newsService.getPublicNewsDetail(news_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Get('/myPost', { transformResponse: false })
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get my news post',
  })
  async getMyPosts(
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
    @QueryParam('status')
    status: string,
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
  ) {
    try {
      return this.newsService.getMyNewsPost(user._id, page, limit, status);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Get('/myPost/:news_id', { transformResponse: false })
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get my news post detail',
  })
  async getMyPostDetail(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('news_id') news_id: string,
  ) {
    try {
      return this.newsService.getMyNewsPostDetail(user._id, news_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Post('/createDraft', { transformResponse: false })
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create new draft',
  })
  async createDraft(
    @CurrentUser({ required: true }) client: CurrentUserOnRedisDocument,
    @Body() createDraftDto: CreateDraftDto,
  ) {
    try {
      return this.newsService.createNewsDraft(client._id, createDraftDto);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Post('/saveDraft/:draft_id', { transformResponse: false })
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Save draft',
  })
  async saveNewsDraft(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Body() updateDraftDto: SaveDraftDto,
    @Param('draft_id') draft_id: string,
  ) {
    try {
      return this.newsService.saveNewsDraft(user._id, draft_id, updateDraftDto);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Post('', { transformResponse: false })
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Create News',
  })
  async createOfficialNews(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Body() createNewsDto: CreateNewsDto,
  ) {
    try {
      if (
        !(await this.newsService.createOfficialNews(user._id, createNewsDto))
      ) {
        throw new NotFoundError('Cannot create : Not found !');
      }
      return {
        message: 'Created Sucessfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Put('/:news_id', { transformResponse: false })
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Modify official news',
  })
  async updateOfficialNews(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('news_id') news_id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    try {
      if (
        !(await this.newsService.updateOfficialNews(
          user._id,
          news_id,
          updateNewsDto,
        ))
      )
        throw new NotFoundError('Cannot update : Not found !');
      return {
        message: 'Updated Sucessfully !',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @Delete('/:news_id', { transformResponse: false })
  @Authorized(['admin'])
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Delete news/draft',
  })
  async deleteNewsOrDraft(
    @CurrentUser({ required: true }) user: CurrentUserOnRedisDocument,
    @Param('news_id') news_id: string,
  ) {
    try {
      if (!(await this.newsService.deleteNewsOrDraft(user._id, news_id))) {
        throw new NotFoundError('Cannot delete : Not found !');
      }
      return {
        message: 'Deleted Sucessfully !',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
