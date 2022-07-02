import { Invite, iStatus } from "../entities/Invite";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types/MyContext";
import { InvitationMutationResponse } from "../types/InvitationMutationResponse";
import { InviteInput } from "../types/InviteInput";
import { User } from "../entities/User";
import { Owner } from "../entities/Owner";
import { Room } from "../entities/Room";
import { RoomFavourite } from "../entities/RoomFavourite";

@Resolver(_of => Invite)
export class InviteResolver {
    @Query(_return => [Invite], {nullable: true})
    async myInvitations(
        @Ctx() ctx: MyContext,
    ): Promise<Invite[] | null> {
        if(!ctx.req.session.userId || ctx.req.session.role !== "owner") {
            return null;
        }
        return await Invite.find({
            where: {
                ownerId: ctx.req.session.userId,
            }, 
            relations: ["user", "room"]
        });
    }

    @Query(_return => [Invite], {nullable: true})
    async invitationsToMe(
        @Ctx() ctx: MyContext,
    ): Promise<Invite[] | null> {
        if(!ctx.req.session.userId || ctx.req.session.role !== "user") {
            return null;
        }
        return await Invite.find({
            where: {
                userId: ctx.req.session.userId,
            },
            relations: ["owner", "room"]
        });
    }

    @Mutation(_return => InvitationMutationResponse)
    async invite(
        @Arg("inviteInput") inviteInput: InviteInput,
        @Ctx() ctx: MyContext
    ): Promise<InvitationMutationResponse> {
        if(!ctx.req.session.userId || ctx.req.session.role !== "owner") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to invite user"
            }
        }
        const user = await User.findOne({
            where: {
                id: inviteInput.userId,
            }
        });
        if (!user) {
            return {
                code: 400,
                success: false,
                message: "User not found"
            }
        }
        const owner = await Owner.findOne({
            where: {
                id: ctx.req.session.userId,
            }
        }
        );
        if (!owner) {
            return {
                code: 400,
                success: false,
                message: "Owner not found"
            }
        }
        const room = await Room.findOne({
            where: {
                ownerId: ctx.req.session.userId,
                id: inviteInput.roomId,
            }
        });
        if (!room) {
            return {
                code: 400,
                success: false,
                message: "Room not found or you are not the owner " + ctx.req.session.userId
            }
        }

        const roomFavourite = await RoomFavourite.findOne(
            {
                where: {
                    userId: inviteInput.userId,
                    roomId: inviteInput.roomId,
                }
            }
        );
        if (!roomFavourite) {
            return {
                code: 400,
                success: false,
                message: "room is not in favourite list of user"
            }
        }
        
        const invite = await Invite.create({
            user,
            owner,
            room,
            timeOfCheck: inviteInput.timeOfCheck,
        }).save();
        return {
            code: 200,
            success: true,
            message: "Successfully invited",
            invite,
        };
    }

    @Mutation(_return => InvitationMutationResponse)
    async acceptInvite(
        @Arg("inviteId") inviteId: string,
        @Ctx() ctx: MyContext
    ): Promise<InvitationMutationResponse> {
        if(!ctx.req.session.userId || ctx.req.session.role !== "user") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to accept invite"
            }
        }
        const invite = await Invite.findOne({
            where: {
                id: inviteId,
            }, relations: ["owner", "room"]
        });
        if (!invite) {
            return {
                code: 400,
                success: false,
                message: "Invite not found"
            }
        }
        if (invite.userId !== ctx.req.session.userId) {
            return {
                code: 400,
                success: false,
                message: "You are not the user"
            }
        }
        if (invite.status !== iStatus.PENDING) {
            return {
                code: 400,
                success: false,
                message: "Invite is already not pending"
            }
        }
        invite.status = iStatus.ACCEPTED;
        await invite.save();
        return {
            code: 200,
            success: true,
            message: "Successfully accepted invite",
            invite,
        };
    }

    @Mutation(_return => InvitationMutationResponse)
    async rejectInvite(
        @Arg("inviteId") inviteId: string,
        @Ctx() ctx: MyContext
    ): Promise<InvitationMutationResponse> {
        if(!ctx.req.session.userId || ctx.req.session.role !== "user") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to reject invite"
            }
        }
        const invite = await Invite.findOne({
            where: {
                id: inviteId,
            }, relations: ["owner", "room"]
        });
        if (!invite) {
            return {
                code: 400,
                success: false,
                message: "Invite not found"
            }
        }
        if (invite.userId !== ctx.req.session.userId) {
            return {
                code: 400,
                success: false,
                message: "You are not the user"
            }
        }
        if (invite.status !== iStatus.PENDING) {
            return {
                code: 400,
                success: false,
                message: "Invite is already not pending"
            }
        }
        invite.status = iStatus.REJECTED;
        await invite.save();
        return {
            code: 200,
            success: true,
            message: "Successfully rejected invite",
            invite,
        };
    }

    

}