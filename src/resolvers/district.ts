import { Wards } from "../entities/Wards";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Districts } from "../entities/Districts";

@Resolver(_of => Districts)
export class DistrictsResolver {
    @Query(_return => [Districts])
    async districts(): Promise<Districts[]> {
        return await Districts.find();
    }

    @Query(_return => [Districts])
    async districtsOfProvince(
        @Arg("provinceCode") provinceCode: string,
    ): Promise<Districts[]> {
        return await Districts.find({
            where: {
                province_code: provinceCode
            }
        });
    }

    @FieldResolver(_return => [Wards])
    async wards(
        @Root() root: Districts,
    ): Promise<Wards[] | undefined> {
        return await Wards.find({
            where: {
                district_code: root.code
            }
        });
    }
}