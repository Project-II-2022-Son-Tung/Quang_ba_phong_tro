import { CreateOfferDto } from './dtos/CreateOffer.dto';
import { UpdateOfferDto } from './dtos/UpdateOffer.dto';
import { OfferDocument, OfferModel } from './offer.model';

/* eslint-disable @typescript-eslint/ban-types */
export class OfferRepository {
  async getOfferListWithProviderPopulate(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<OfferDocument[] | null> {
    return OfferModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'provider_id', select: ['fullname', 'avatar'] })
      .lean();
  }

  async getOfferListWithProductPopulate(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<OfferDocument[] | null> {
    return OfferModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'provider_id', select: ['fullname', 'avatar'] })
      .populate({ path: 'product_id', select: 'name description' })
      .lean();
  }

  async getUserOffer(
    user_id: string,
    job_id: string,
    selectQuery: {},
  ): Promise<OfferDocument | null> {
    return OfferModel.findOne({ provider_id: user_id, job_id })
      .select(selectQuery)
      .lean();
  }

  async getOfferById(id: string): Promise<OfferDocument | null> {
    return OfferModel.findById(id).lean();
  }

  async updateOffer(
    offer_id: string,
    updateOfferDto: UpdateOfferDto,
  ): Promise<OfferDocument | null> {
    return OfferModel.findByIdAndUpdate(
      offer_id,
      { ...updateOfferDto },
      { new: true },
    );
  }

  async createOffer(
    user_id: string,
    job_id: string,
    createOfferDto: CreateOfferDto,
  ): Promise<OfferDocument | null> {
    const offer = new OfferModel({
      ...createOfferDto,
      provider_id: user_id,
      job_id,
    });
    return offer.save();
  }

  async deleteOffer(
    user_id: string,
    offer_id: string,
  ): Promise<OfferDocument | null> {
    const offer = await OfferModel.findById(offer_id);
    if (offer && offer.provider_id.toString() === user_id) {
      return offer.remove();
    }
    throw new Error('Offer not found or you do not have permision to delete');
  }

  async acceptOffer(offer_id: string): Promise<OfferDocument | null> {
    return OfferModel.findByIdAndUpdate(offer_id, { status: 1 }, { new: true });
  }
}
