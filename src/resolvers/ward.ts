import { Arg, Query, Resolver } from "type-graphql";
import { Wards } from "../entities/Wards";

@Resolver(_of => Wards)
export class WardsResolver {
    @Query(_return => [Wards])
    async wards(): Promise<Wards[]> {
        return await Wards.find();
    }

    @Query(_return => [Wards])
    async wardsOfDistrict(
        @Arg("districtCode") districtCode: string,
    ): Promise<Wards[]> {
        return await Wards.find({
            where: {
                district_code: districtCode
            }
        });
    }
}