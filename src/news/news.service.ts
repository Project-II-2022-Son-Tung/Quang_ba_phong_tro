import { BadRequestError, NotFoundError } from 'routing-controllers';
import { CategoryService } from '../category/category.service';
import { CreateDraftDto } from './dtos/createDraft.dto';
import { CreateNewsDto } from './dtos/createNews.dto';
import { SaveDraftDto } from './dtos/saveDraft.dto';
import { UpdateNewsDto } from './dtos/updateNews.dto';
import { NewsStatus } from './news-status.enum';
import { NewsDocument } from './news.model';
import { NewsRepository } from './news.repository';

export class NewsService {
  private readonly newsRepository = new NewsRepository();
  private readonly categoryService = new CategoryService();

  async getPublicNews(page: number, limit: number, categorySlug: string) {
    const query = { status: NewsStatus.ACTIVE };
    const selectQuery = { title: 1, thumbnail: 1 };
    const sort_by = '-priority -create_time';
    if (categorySlug) {
      const categoriesIDArray =
        await this.categoryService.getCategoriesIDBySlugString(categorySlug);
      Object.assign(query, { category: { $in: categoriesIDArray } });
    }
    const total = await this.newsRepository.getNumberOfServiceWithFilter(query);
    const data = await this.newsRepository.getPublicNewsList(
      page,
      limit,
      query,
      selectQuery,
      sort_by,
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

  async getPublicNewsDetail(news_id: string) {
    const query = { _id: news_id, status: NewsStatus.ACTIVE };
    const populateOptions = [
      { path: 'user_id', select: '_id fullname avatar' },
      { path: 'category', select: '-description' },
    ];
    return this.newsRepository.getPublicNewsDetail(query, populateOptions);
  }

  async getMyNewsPost(
    user_id: string,
    page: number,
    limit: number,
    status: string,
  ) {
    const query = { user_id, status: { $not: { $eq: NewsStatus.DELETED } } };
    const selectQuery = { title: 1, thumbnail: 1, create_time: 1 };
    const sort_by = '-create_time';
    if (status) {
      Object.assign(query, {
        status: {
          $in: status.split(',').map((x) => {
            return x !== NewsStatus.DELETED.toString() ? +x : null;
          }),
        },
      });
    }
    const total = await this.newsRepository.getNumberOfServiceWithFilter(query);
    const data = await this.newsRepository.getPublicNewsList(
      page,
      limit,
      query,
      selectQuery,
      sort_by,
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

  async getMyNewsPostDetail(user_id: string, news_id: string) {
    const query = {
      _id: news_id,
      user_id,
      status: { $not: { $eq: NewsStatus.DELETED } },
    };
    const populateOptions = [];
    return this.newsRepository.getPublicNewsDetail(query, populateOptions);
  }

  async createNewsDraft(user_id: string, createDraftDto: CreateDraftDto) {
    Object.assign(createDraftDto, {
      status: NewsStatus.DRAFT,
    });
    return this.newsRepository.createNewsDraft(user_id, createDraftDto);
  }

  async saveNewsDraft(
    admin_id: string,
    draft_id: string,
    saveDraftDto: SaveDraftDto,
  ) {
    const query = {
      _id: draft_id,
      user_id: admin_id,
      status: NewsStatus.DRAFT,
    };
    return this.newsRepository.updateNews(query, saveDraftDto);
  }

  async createOfficialNews(admin_id: string, createNewsDto: CreateNewsDto) {
    Object.assign(createNewsDto, {
      status: NewsStatus.ACTIVE,
    });
    if (createNewsDto._id) {
      const query = {
        _id: createNewsDto._id,
        user_id: admin_id,
        status: NewsStatus.DRAFT,
      };
      const createdNewsFromDraft: NewsDocument =
        await this.newsRepository.updateNews(query, createNewsDto);
      if (createdNewsFromDraft) return createdNewsFromDraft;
      delete createNewsDto._id; //delete deleted draft _id to create new NewsDocument
    }
    return this.newsRepository.createNewsDraft(admin_id, createNewsDto);
  }

  async updateOfficialNews(
    admin_id: string,
    news_id: string,
    updateNewsDto: UpdateNewsDto,
  ) {
    const query = {
      _id: news_id,
      user_id: admin_id,
      status: NewsStatus.ACTIVE,
    };
    return this.newsRepository.updateNews(query, updateNewsDto);
  }

  async deleteNewsOrDraft(admin_id: string, news_id: string) {
    const query = {
      _id: news_id,
      user_id: admin_id,
      status: { $not: { $eq: NewsStatus.DELETED } },
    };
    const updateOptions = { status: NewsStatus.DELETED };
    return this.newsRepository.updateNews(query, updateOptions);
  }
}
