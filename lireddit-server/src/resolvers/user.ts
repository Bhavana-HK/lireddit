import { User } from 'src/entities/User';
import { MyContext } from 'src/types';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';

//resolvers have functions, which can be mutations or queries

// The aguments can be typed as a class with @InputType decorator
@InputType()
class UsernamePasswordInput {
    @Field()
    username!: string;

    @Field()
    password!: string;
}

@Resolver()
export class UserResolver {
    // Register a new user
    @Mutation(() => String)
    register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<User> {
        const user = em.create(User, {
            username: options.username,
            password: options.password,
        });

        return em.persistAndFlush(user).then(() => user);
    }
}
