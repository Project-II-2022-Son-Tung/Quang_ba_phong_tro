import { Field, InterfaceType } from "type-graphql";

@InterfaceType()
export abstract class IRegisterInput {
    @Field()
    username: string

    @Field()
    email: string

    @Field()
    password: string

    @Field()
    fullName: string

}