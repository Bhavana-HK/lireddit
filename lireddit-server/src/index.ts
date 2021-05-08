import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import { PostResolver } from './resolvers/post';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

/**
 * run yarn watch and yarn dev
 * if the migations are not running fine, delete the dist folder, and run watch again
 */

/**
 * Sessions:
 * We are storing a cookie in the user's browser and sessions are used to keep track of
 * the authentication. To do that we use express-session. The user's data is stored in the server
 * and every time a request is made, the cookie is verified with the session stored.
 * This has to be extremely fast -- any database can be used for the storage, here we're using redis
 * 
 * 1.  sess:3745435er -> { userId: 2 }
 * redis stores data as key-value pairs. so a key "sess:3745435er" will have a value { userId: 2 }
 * 
 * 2. req.session.userId = 2
 * when we do this, the session key and value is stored in redis
 * the express-session will set a cookie on my browser qocnns3uhwul32323oqwkw9quj3
 * cookie is the session key is encrypted with the secret provided
 * 
 * 3. qocnns3uhwul32323oqwkw9quj3 -> sent to server
 * when user makes a request
 * 
 * 4. qocnns3uhwul32323oqwkw9quj3 -> sess:3745435er
 * decrypt the cookie
 * 
 * 5. sess:3745435er -> { userId: 2 }
 * make request to redis and grab the user id
 * 
 * 6. req.session = { userId: 2 }
 * the server now stores the info in session
 * 
 * Redis installation:
 * download zip: https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504
 * extract to anywhere (C:\Program Files\Redis)
 * add it to the path variable
 * execute in command prompt: 'redis-server' and 'redis-cli ping'
 */

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);

    /**
     * to creat a migration, npx micro-orm migration:create (yarn create:migration)
     * the below line executes all the created migations which have never run before.
     * once run, mikro orm keeps a track of them and does not re-run
     */
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 365 * 10, // 10 years
                httpOnly: true, // front end js cannot access cookie
                secure: __prod__, // works only in https
                sameSite: 'lax', //csrf
            },
            saveUninitialized: false,
            secret: 'dawsdqwujequ8ihqwuyewu',
            resave: false,
        })
    );

    /**
     * context is a special obejct that is accessible by all the resolvers.
     * we want to query the db in our resolver.
     * so pass the enity manager (orm.em) in the context
     */
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    });

    apolloServer.applyMiddleware({ app });

    /**
     * To Query:
     * const posts = await orm.em.find(Post, {});
     * console.log(posts);
     *
     * To insert:
     * const post = orm.em.create(Post, {title:'Post title'});
     * await orm.em.persistAndFlush(post);
     *
     * open the graphql playground by: http://localhost:4000/graphql
     */

    app.listen(4000, () =>
        console.log(
            'Server started on port 4000. GraphQL: http://localhost:4000/graphql'
        )
    );
};

main().catch((err) => console.log(err));
