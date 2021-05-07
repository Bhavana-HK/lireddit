import { Query, Resolver } from 'type-graphql';

//resolvers have functions, which can be mutations or queries

@Resolver()
export class Resolvers {
  @Query(() => String)
  hello() {
    return 'world';
  }
}
