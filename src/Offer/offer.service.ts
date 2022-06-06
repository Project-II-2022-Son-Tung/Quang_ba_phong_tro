import { ForbiddenError } from 'routing-controllers';
import { UserModelUnselectableFields } from '../user/user.model';
import { ProductModel } from '../product/product.model';
import { OfferDocument } from './offer.model';
import { OfferRepository } from './offer.repository';
import { UpdateOfferDto } from './dtos/UpdateOffer.dto';
import { CreateOfferDto } from './dtos/CreateOffer.dto';

export class OfferService {
  private readonly offerRepository = new OfferRepository();

  async getOfferList(
    user_id: string,
    user_type: string,
    page: number,
    limit: number,
    jobId: string,
    select: string,
  ): Promise<OfferDocument[] | null> {
    try {
      const selectQuery = {};
      if (select) {
        const fieldsArray = select.split(',');
        fieldsArray.forEach((value) => {
          if (!UserModelUnselectableFields.includes(value))
            selectQuery[value] = 1;
        });
      }
      if (user_type === 'client') {
        const desired_job = (await ProductModel.findById(jobId)).toJSON();
        const desired_user_id = await desired_job.user_id.toString();
        if (desired_user_id === user_id) {
          return this.offerRepository.getOfferListWithProviderPopulate(
            page,
            limit,
            { job_id: jobId },
            selectQuery,
          );
        }
        throw new ForbiddenError('You are not allowed to access to the offers');
      }
      return this.offerRepository.getOfferListWithProductPopulate(
        page,
        limit,
        { job_id: jobId },
        selectQuery,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMyOffer(
    user_id: string,
    page: number,
    limit: number,
    select: string,
  ): Promise<OfferDocument[] | null> {
    try {
      const selectQuery = {};
      if (select) {
        const fieldsArray = select.split(',');
        fieldsArray.forEach((value) => {
          if (!UserModelUnselectableFields.includes(value))
            selectQuery[value] = 1;
        });
      }
      return this.offerRepository.getOfferListWithProviderPopulate(
        page,
        limit,
        { provider_id: user_id },
        selectQuery,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMyOfferByJobId(
    user_id: string,
    jobId: string,
    select: string,
  ): Promise<OfferDocument[] | null> {
    try {
      const selectQuery = {};
      if (select) {
        const fieldsArray = select.split(',');
        fieldsArray.forEach((value) => {
          if (!UserModelUnselectableFields.includes(value))
            selectQuery[value] = 1;
        });
      }
      return this.offerRepository.getOfferListWithProviderPopulate(
        1,
        1,
        { job_id: jobId, provider_id: user_id },
        selectQuery,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateMyOffer(
    user_id: string,
    jobId: string,
    updateOfferDto: UpdateOfferDto,
  ): Promise<OfferDocument | null> {
    const my_offer = await this.offerRepository.getUserOffer(
      user_id,
      jobId,
      {},
    );
    if (my_offer && my_offer.status === 0) {
      return this.offerRepository.updateOffer(
        my_offer._id.toString(),
        updateOfferDto,
      );
    }
    throw new Error('Offer not found or you do not have permision to update');
  }

  async createOffer(
    user_id: string,
    jobId: string,
    createOfferDto: CreateOfferDto,
  ): Promise<OfferDocument | null> {
    const job = await ProductModel.findById(jobId);
    if (job) {
      const existing_offer = await this.offerRepository.getUserOffer(
        user_id,
        jobId,
        {},
      );
      if (existing_offer) throw new Error('You already have an offer');
      const offer = await this.offerRepository.createOffer(
        user_id,
        jobId,
        createOfferDto,
      );
      return offer;
    }
    throw new Error('Job not found');
  }

  async deleteMyOffer(
    user_id: string,
    jobId: string,
  ): Promise<OfferDocument | null> {
    const my_offer = await this.offerRepository.getUserOffer(
      user_id,
      jobId,
      {},
    );
    if (my_offer && my_offer.status === 0) {
      return this.offerRepository.deleteOffer(user_id, my_offer._id.toString());
    }
    throw new Error('Offer not found or you do not have permision to delete');
  }
}
