import { Post } from '../entities/Post';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { MyContext } from '../types';

// resolvers have functions, which can be mutations or queries
// mutations are for inserting and updating data
@Resolver()
export class PostResolver {
    // Fetch all posts
    // 'posts' is a query that takes the context as a parameter
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    // Get post by ID
    // query a post by its id, accept an argument. Need to specify the typescript type, as well as the graphql type
    // for query return type, we cannot Post | null, but rather give options that say nullable
    // @Arg('id', () => Int) or just @Arg('id') with type inferred
    @Query(() => Post, { nullable: true })
    post(
        @Ctx() { em }: MyContext,
        @Arg('id') id: number
    ): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    // Create a new post
    // using promises
    @Mutation(() => Post)
    createPost(
        @Ctx() { em }: MyContext,
        @Arg('title') title: string
    ): Promise<Post> {
        const post = em.create(Post, { title });
        return em.persistAndFlush(post).then(() => post);
    }

    // Update a post
    // using async/await
    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Ctx() { em }: MyContext,
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) return null;

        if (typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post);
        }

        return post;
    }

    // Delete a post
    @Mutation(() => Boolean)
    async deletePost(
        @Ctx() { em }: MyContext,
        @Arg('id') id: number
    ): Promise<boolean> {
        // using the remove and flush
        // const post = await em.findOne(Post, { id });
        // if (!post) return false;

        // return em
        //   .removeAndFlush(post)
        //   .then(() => true)
        //   .catch(() => false);

        // using native delete
        // reurns number of records deleted
        return em
            .nativeDelete(Post, { id })
            .then((res: number) => !!res)
            .catch(() => false);
    }
}
