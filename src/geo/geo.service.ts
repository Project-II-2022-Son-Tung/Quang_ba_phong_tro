import { GeoRepository } from './geo.repository';

export class GeoService {
  private readonly geoRepository = new GeoRepository();

  async getCountryByCode(code: string) {
    return this.geoRepository.getCountryByCode(code);
  }

  async getProvinceByCode(code: string) {
    return this.geoRepository.getProvinceByCode(code);
  }

  async getProvinceByCountryCode(country_code: string) {
    return this.geoRepository.getProvinceByCountryCode(country_code);
  }

  async getDistrictByCode(code: string) {
    return this.geoRepository.getDistrictByCode(code);
  }

  async getDistrictByProvinceCode(province_code: string) {
    return this.geoRepository.getDistrictByProvinceCode(province_code);
  }

  async getWardByCode(code: string) {
    return this.geoRepository.getWardByCode(code);
  }

  async getWardByDistrictCode(district_code: string) {
    return this.geoRepository.getWardByDistrictCode(district_code);
  }

  async getAllCountries() {
    return this.geoRepository.getAllCountries();
  }

  async getAllProvinces() {
    return this.geoRepository.getAllProvinces();
  }

  async getAllDistricts() {
    return this.geoRepository.getAllDistricts();
  }

  async getAllWards() {
    return this.geoRepository.getAllWards();
  }
}
