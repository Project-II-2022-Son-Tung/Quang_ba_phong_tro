import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { AnyKeys, FilterQuery, PopulateOptions, QuerySelector, UpdateQuery } from 'mongoose';
import { News, NewsModel } from './news.model';

export class NewsRepository {
  async getPublicNewsList(
    page: number,
    limit: number,
    query: FilterQuery<News>,
    selectQuery: {},
    sortQuery: string,
  ) {
    return NewsModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortQuery)
      .lean();
  }

  async getPublicNewsDetail(query: FilterQuery<News>,populateOptions: PopulateOptions[]) {
    return NewsModel.find(query).populate(populateOptions);
  }

  async getNumberOfServiceWithFilter(query: FilterQuery<News>) {
    return NewsModel.countDocuments(query);
  }

  async createNewsDraft(
    admin_id: string,
    createDraftDto: AnyKeys<DocumentType<News, BeAnObject>>,
  ) {
    return NewsModel.create({
      user_id: admin_id,
      ...createDraftDto,
    });
  }

  async updateNews(query: FilterQuery<News>, updateNews: UpdateQuery<News>) {
    return NewsModel.findOneAndUpdate(
      query,
      {
        ...updateNews,
      },
      {
        new: true,
      },
    );
  }
}
