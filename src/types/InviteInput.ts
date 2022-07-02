import { Field, InputType } from "type-graphql";

@InputType()
export class InviteInput {
    @Field()
    userId: string

    @Field()
    timeOfCheck: Date

    @Field()
    roomId: string


}