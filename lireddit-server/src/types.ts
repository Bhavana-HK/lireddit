import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

// used for passing the entity manger(em) to the graphql resolver
export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
}