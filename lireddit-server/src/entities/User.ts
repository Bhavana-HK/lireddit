import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

// every time you add a new entity, add the entity in mikro-orm.config
// and create the table by running the migartion command
// yarn create:migration

@ObjectType()
@Entity()
export class User {
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
    @Property({ type: 'text', unique: true })
    username!: string;

    @Property({ type: 'text' })
    password!: string;
}
