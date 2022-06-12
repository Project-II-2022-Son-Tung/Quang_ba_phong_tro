import { Field, InputType } from "type-graphql";
import { IRegisterInput } from "./RegisterInput";

@InputType()
export class UserRegisterInput implements IRegisterInput {
    @Field({nullable: true})
    identificationId?: string

    @Field({nullable: true})
    issueDate?: Date

    @Field({nullable: true})
    issuedBy?: string

    @Field()
    avatarUrl?: string

    @Field({nullable: true})
    address?: string

    @Field({nullable: true})
    phoneNumber?: string
    
    @Field()
    username: string

    @Field()
    email: string

    @Field()
    password: string

    @Field()
    fullName: string

    // @Field({nullable: true})
    // salary?: number

    


}