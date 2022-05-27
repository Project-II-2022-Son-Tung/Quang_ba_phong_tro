import {
  JsonController,
  Get,
  Param,
  BadRequestError,
  Authorized,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { GeoService } from './geo.service';

@JsonController('/geo')
export class GeoController {
  private readonly geoService = new GeoService();

  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(['admin', 'client'])
  @Get('/countries', { transformResponse: false })
  async getAllCountries() {
    return this.geoService.getAllCountries();
  }

  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(['admin', 'client'])
  @Get('/countries/:code')
  async getCountryByCode(@Param('code') code: string) {
    try {
      return this.geoService.getCityByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(['admin', 'client'])
  @Get('/cities', { transformResponse: false })
  async getAllCities() {
    return this.geoService.getAllCities();
  }

  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(['admin', 'client'])
  @Get('/cities/:code')
  async getCityByCode(@Param('code') code: string) {
    try {
      return this.geoService.getCityByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(['admin', 'client'])
  @Get('/cities/bycountry/:country_code')
  @OpenAPI({ description: 'get City By Id' })
  async getCityByCountryCode(@Param('country_code') country_code: string) {
    try {
      return this.geoService.getCityByCountryCode(country_code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(['admin', 'client'])
  @Get('/districts', { transformResponse: false })
  async getAllDistricts() {
    return this.geoService.getAllDistricts();
  }

  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(['admin', 'client'])
  @Get('/districts/:code')
  async getDistrictByCode(@Param('code') code: string) {
    try {
      return this.geoService.getDistrictByCode(code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({ security: [{ BearerAuth: [] }] })
  @Authorized(['admin', 'client'])
  @Get('/districts/bycity/:city_code')
  async getDistrictByCityCode(@Param('city_code') city_code: string) {
    try {
      return this.geoService.getDistrictByCityCode(city_code);
    } catch (e) {
      throw new BadRequestError(e.message);
    }
  }
}
