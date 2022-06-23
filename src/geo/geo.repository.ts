import { DocumentType } from '@typegoose/typegoose';
import { Province, ProvinceModel } from './province.model';
import { Country, CountryModel } from './country.model';
import { District, DistrictModel } from './district.model';
import { WardModel } from './ward.model';

export class GeoRepository {
  async getCountryByCode(code: string): Promise<DocumentType<Country> | null> {
    return CountryModel.findOne({ code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
      })
      .lean();
  }

  async getProvinceByCode(
    code: string,
  ): Promise<DocumentType<Province> | null> {
    return ProvinceModel.findOne({ code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        country_code: 1,
      })
      .lean();
  }

  async getProvinceByCountryCode(country_code: string) {
    return ProvinceModel.find({ country_code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        country_code: 1,
      })
      .lean();
  }

  async getDistrictByCode(
    code: string,
  ): Promise<DocumentType<District> | null> {
    return DistrictModel.findOne({ code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        province_code: 1,
      })
      .lean();
  }

  async getDistrictByProvinceCode(province_code: string) {
    return DistrictModel.find({ province_code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        province_code: 1,
      })
      .lean();
  }

  async getWardByCode(code: string): Promise<DocumentType<District> | null> {
    return WardModel.findOne({ code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        district_code: 1,
      })
      .lean();
  }

  async getWardByDistrictCode(district_code: string) {
    return WardModel.find({ district_code })
      .select({
        _id: 0,
        code: 1,
        name: 1,
        district_code: 1,
      })
      .lean();
  }

  async getAllCountries() {
    return CountryModel.find().lean();
  }

  async getAllProvinces() {
    return ProvinceModel.find().lean();
  }

  async getAllDistricts() {
    return DistrictModel.find().lean();
  }

  async getAllWards() {
    return WardModel.find().lean();
  }
}
