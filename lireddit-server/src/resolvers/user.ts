import { User } from '../entities/User';
import { MyContext } from '../types';
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql';
import * as argon2 from 'argon2';
import { COOKIE_NAME } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { FieldError } from './FieldError';
import { validateRegister } from '../utils/validateRegister';

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    // forgot password
    @Mutation(() => Boolean)
    forgotPassword(
        @Ctx() { req, em }: MyContext,
        @Arg('email') email: string
    ): boolean {
        console.log(email, req, em);
        return true;
    }

    // Return the current user if already loged in. Null otherwise
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
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
        const response = validateRegister(options);
        if (response.length) return { errors: response };

        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
            email: options.email,
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
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(
            User,
            usernameOrEmail.includes('@')
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail }
        );

        if (!user)
            return {
                errors: [
                    {
                        field: 'usernameOrEmail',
                        message: "This user does't exist",
                    },
                ],
            };

        const matched = await argon2.verify(user.password, password);
        if (!matched)
            return {
                errors: [{ field: 'password', message: 'Incorrect password' }],
            };

        req.session.userId = user.id;

        return { user };
    }

    // logout user
    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
        return new Promise((resolve) => {
            // removes the session in redis
            req.session.destroy((err) => {
                // removes the cookie on client side
                res.clearCookie(COOKIE_NAME);

                if (err) return resolve(false);
                return resolve(true);
            });
        });
    }
}
