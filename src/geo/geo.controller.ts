import {
  JsonController,
  Get,
  Param,
  BadRequestError,
} from 'routing-controllers';
import { GeoService } from './geo.service';

@JsonController('/geo')
export class GeoController {
  private readonly geoService = new GeoService();

  @Get('/countries', { transformResponse: false })
  async getAllCountries() {
    return this.geoService.getAllCountries();
  }

  @Get('/countries/:code')
  async getCountryByCode(@Param('code') code: string) {
    try {
      return this.geoService.getProvinceByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/provinces', { transformResponse: false })
  async getAllProvinces() {
    return this.geoService.getAllProvinces();
  }

  @Get('/provinces/:code')
  async getProvinceByCode(@Param('code') code: string) {
    try {
      return this.geoService.getProvinceByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/provinces/bycountry/:country_code')
  async getProvinceByCountryCode(@Param('country_code') country_code: string) {
    try {
      return this.geoService.getProvinceByCountryCode(country_code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/districts', { transformResponse: false })
  async getAllDistricts() {
    return this.geoService.getAllDistricts();
  }

  @Get('/districts/:code')
  async getDistrictByCode(@Param('code') code: string) {
    try {
      return this.geoService.getDistrictByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/districts/byprovince/:province_code')
  async getDistrictByProvinceCode(
    @Param('province_code') province_code: string,
  ) {
    try {
      return this.geoService.getDistrictByProvinceCode(province_code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/wards', { transformResponse: false })
  async getAllWards() {
    return this.geoService.getAllWards();
  }

  @Get('/wards/:code', { transformResponse: false })
  async getWardByCode(@Param('code') code: string) {
    try {
      return this.geoService.getWardByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @Get('/wards/bydistrict/:district_code')
  async getWardByDistrictCode(@Param('district_code') district_code: string) {
    try {
      return this.geoService.getWardByDistrictCode(district_code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}
