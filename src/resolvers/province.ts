import { Districts } from "../entities/Districts";
import { FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Provinces } from "../entities/Provinces";

@Resolver(_of => Provinces)
export class ProvincesResolver {
    @Query(_return => [Provinces])
    async provinces(): Promise<Provinces[]> {
        return await Provinces.find();
    }

    @FieldResolver(_return => [Districts])
    async districts(
        @Root() root: Provinces,
    ): Promise<Districts[] | undefined> {
        return await Districts.find({
            where: {
                province_code: root.code
            }
        });
    }
}