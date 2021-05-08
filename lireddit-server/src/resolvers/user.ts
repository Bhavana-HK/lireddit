import { User } from '../entities/User';
import { MyContext } from '../types';
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql';
import * as argon2 from 'argon2';

//resolvers have functions, which can be mutations or queries

// The function aguments can be typed as a class with @InputType decorator
// The function returns can be typed as a class with @ObjectType decorator
@InputType()
class UsernamePasswordInput {
    @Field()
    username!: string;

    @Field()
    password!: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    // Return the current user if already loged in. Null otherwise
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
        console.log(req.session);

        // you are not logged in
        if (!req.session.userId) return null;
        const user = await em.findOne(User, { id: req.session.userId });
        return user;
    }

    // Register a new user
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'Username is too short',
                    },
                ],
            };
        }
        if (options.password.length <= 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'length must be atleast 4',
                    },
                ],
            };
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
        });

        return em
            .persistAndFlush(user)
            .then(() => {
                /**
                 * store user id session
                 * this will set a cookie on the header
                 * keeps them logged in
                 */
                req.session.userId = user.id;
                return { user };
            })

            .catch((err) => {
                if (err.name === 'UniqueConstraintViolationException')
                    return {
                        errors: [
                            {
                                field: 'username',
                                message: 'Username is already taken',
                            },
                        ],
                    };

                return {
                    errors: [
                        {
                            field: 'username',
                            message: err.message,
                        },
                    ],
                };
            });
    }

    // Login a user
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });
        if (!user)
            return {
                errors: [
                    {
                        field: 'username',
                        message: "This username does't exist",
                    },
                ],
            };

        const matched = await argon2.verify(user.password, options.password);
        if (!matched)
            return {
                errors: [{ field: 'password', message: 'Incorrect password' }],
            };

        req.session.userId = user.id;

        return { user };
    }
}
