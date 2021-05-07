import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Resolvers } from './resolvers/index';
import { PostResolver } from './resolvers/post';

// run yarn watch and yarn dev
// if the migations are not running fine, delete the distfolder, and run watch again

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  // to creat a migration manually, npx micro-orm migration:create
  await orm.getMigrator().up();

  const app = express();

  // context is a special obejct that is accessible by all the resolvers
  // we want to query the db in our resolver. so pass the enity manager (orm.em) in the context
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [Resolvers, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  // To Query:
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);

  // To insert:
  // const post = orm.em.create(Post, {title:'Post title'});
  // await orm.em.persistAndFlush(post);

  // open the graphql playground by: http://localhost:4000/graphql

  app.listen(4000, () =>
    console.log(
      'Server started on port 4000. GraphQL: http://localhost:4000/graphql'
    )
  );
};

main().catch((err) => console.log(err));
