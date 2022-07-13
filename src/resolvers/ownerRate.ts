import { ListOwnerRateResponse } from "../types/ListOwnerRateResponse";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { OwnerRate } from "../entities/OwnerRate";
import { OwnerRateMutationResponse } from "../types/OwnerRateMutationResponse";
import { MyContext } from "../types/MyContext";
import { CreateOwnerRateInput } from "../types/CreateOwnerRateInput";
import { Invite, iStatus } from "../entities/Invite";
import { RateImage } from "../entities/RateImage";
import { UpdateOwnerRateInput } from "../types/UpdateOwnerRateInput";
import { Owner } from "../entities/Owner";

@Resolver(_of => OwnerRate)
export class OwnerRateResolver {

    @FieldResolver(_type => [RateImage])
    async images(@Root() ownerRate: OwnerRate): Promise<RateImage[]> {
        return await RateImage.find({
            where: {
                rateId : ownerRate.id
            }
        });
    }
    
    @Query(_return => ListOwnerRateResponse)
    async ownerRates(
        @Arg("page") page: number,
        @Arg("limit") limit: number,
        @Arg("ownerId") ownerId: string
    ): Promise<ListOwnerRateResponse> {
        const realLimit = Math.min(limit, 20);
        const ownerRates = await OwnerRate.find({
            where: { ownerId },
            skip: (page - 1) * realLimit,
            take: realLimit,
            relations: ["user"]
        });
        const total = await OwnerRate.count();
        const totalPages = Math.ceil(total / realLimit);
        return {
            ownerRates,
            totalPages,
        };
    }

    @Mutation(_return => OwnerRateMutationResponse)
    async createOwnerRate(
        @Arg("rateInput") rateInput: CreateOwnerRateInput,
        @Ctx() ctx: MyContext
    ): Promise<OwnerRateMutationResponse> {
        if( !ctx.req.session!.userId || ctx.req.session.role !== "user" ) {
            return {
                code: 400,
                success: false,
                message: "You are not logged in"
            }
        }

        const owner = await Owner.findOne({
            where: {
                id: rateInput.ownerId,
            }
        });

        if(!owner) {
            return {
                code: 400,
                success: false,
                message: "Owner does not exist"
            }
        }

        const invitation = (await Invite.find({
            where: {
                ownerId: rateInput.ownerId,
                userId: ctx.req.session!.userId,
            },
            skip: 0,
            take: 1,
            order: {
                timeOfCheck: "ASC"
            }
        }))[0];

        if(!invitation || invitation.status !== iStatus.ACCEPTED) {
            return {
                code: 400,
                success: false,
                message: "You are not invited by this owner"
            }
        }

        if(invitation.timeOfCheck > new Date()) {
            return {
                code: 400,
                success: false,
                message: "You can not rate this owner yet"
            }
        }

        const existingOwnerRate = await OwnerRate.findOne({
            where: {
                ownerId: rateInput.ownerId,
                userId: ctx.req.session!.userId,
            }
        });

        if(existingOwnerRate) {
            return {
                code: 400,
                success: false,
                message: "You have already rated this owner, please update your rate"
            }
        }

        const connection = ctx.connection;
        return await connection.transaction(async transactionEntityManager =>{
            try {                
                await transactionEntityManager.create(OwnerRate, {
                    rate: rateInput.rate,
                    ownerId: rateInput.ownerId,
                    comment: rateInput.comment,
                    userId: ctx.req.session!.userId,
                }).save();

                if(owner.numberOfRates === 0) {
                    await transactionEntityManager.update(Owner, owner.id, {
                        rate: rateInput.rate,
                        numberOfRates: 1,
                    });
                } else {
                    const newRate = (owner.rate * owner.numberOfRates + rateInput.rate) / (owner.numberOfRates + 1);
                    await transactionEntityManager.update(Owner, owner.id, {
                        rate: parseFloat(newRate.toFixed(2)),
                        numberOfRates: owner.numberOfRates + 1,
                    });
                }
                
                return {
                    code: 200,
                    success: true,
                    message: "Successfully created owner rate"
                }
            } catch (error) {
                return {
                    code: 400,
                    success: false,
                    message: "Failed to create owner rate"
                }
            }
        });     

    }

    @Mutation(_return => OwnerRateMutationResponse)
    async updateOwnerRate(
        @Arg("rateInput") rateInput: UpdateOwnerRateInput,
        @Ctx() ctx: MyContext
    ): Promise<OwnerRateMutationResponse> {
        if( !ctx.req.session!.userId || ctx.req.session.role !== "user" ) {
            return {
                code: 400,
                success: false,
                message: "You are not logged in"
            }
        }

        const ownerRate = await OwnerRate.findOne({
            where: {
                id: rateInput.id,
                userId: ctx.req.session!.userId,
            }, relations: ["owner"]
        });

        if(!ownerRate) {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to update this owner's rate"
            }
        }

        if(!ownerRate?.owner) {
            return {
                code: 400,
                success: false,
                message: "Owner does not exist"
            }
        }


        const connection = ctx.connection;
        return await connection.transaction(async transactionEntityManager =>{
            try {
                await transactionEntityManager.update(OwnerRate, {
                    id: rateInput.id,
                }, {
                    rate: rateInput.rate ? rateInput.rate : ownerRate.rate,
                    comment: rateInput.comment ? rateInput.comment : ownerRate.comment,
                });
                if (rateInput.rate !== ownerRate.rate) {
                    const avgRate = (await transactionEntityManager.createQueryBuilder()
                        .select("avg(rate)::numeric(10,2)")
                        .from(OwnerRate, "ownerRate")
                        .where("ownerRate.ownerId = :ownerId", { ownerId: ownerRate.ownerId })
                        .getRawOne()
                        );
                        
                    await transactionEntityManager.update(Owner, {
                        id: ownerRate.ownerId,
                    }, {
                        rate: (avgRate["avg"])
                    });
                }
                return {
                    code: 200,
                    success: true,
                    message: "Successfully updated owner rate"
                }
            } catch (error) {
                return {
                    code: 400,
                    success: false,
                    message: "Failed to update owner rate"
                }
            }
        });     

    }
    


}