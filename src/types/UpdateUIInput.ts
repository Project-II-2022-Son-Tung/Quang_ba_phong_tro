import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateUIInput   {
    @Field({nullable: true})
    identificationId?: string

    @Field({nullable: true})
    issueDate?: Date

    @Field({nullable: true})
    issuedBy?: string

    @Field({nullable: true})
    avatarUrl?: string

    @Field({nullable: true})
    address?: string

    @Field({nullable: true})
    phoneNumber?: string
    
    @Field({nullable: true})
    fullName?: string

}