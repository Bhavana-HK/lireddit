import {
    Field,
    InputType
} from 'type-graphql';

//resolvers have functions, which can be mutations or queries
// The function aguments can be typed as a class with @InputType decorator
// The function returns can be typed as a class with @ObjectType decorator

@InputType()
export class UsernamePasswordInput {
    @Field()
    username!: string;

    @Field()
    password!: string;

    @Field()
    email!: string;
}
