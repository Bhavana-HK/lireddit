import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Post {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: 'date' })
    createdAt: Date = new Date();

    @Field()
    @Property({ onUpdate: () => new Date(), type: 'date' })
    updatedAt: Date = new Date();

    @Field(() => String)
    @Property({ type: 'text' })
    title!: string;
}

/**
 * the graphql resolver requires the 'type' of Post. So, if we let the enity be like:
 * the below, it wont work. That's why add decorators like @ObjectType and @Field to make it 
 * both a type declaration as well as entity. If you dont want to expose a property in  graphql, 
 * dont add @Field 
 * 
    @Entity()
    export class Post {
      @PrimaryKey()
      id!: number;

      @Property({ type: 'date' })
      createdAt: Date = new Date();

      @Property({ onUpdate: () => new Date(), type: 'date' })
      updatedAt: Date = new Date();

      @Property({ type: 'text' })
      title!: string;
    }
 * 
 * 
 *  */
