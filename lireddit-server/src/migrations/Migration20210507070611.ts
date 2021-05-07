import { Migration } from '@mikro-orm/migrations';

export class Migration20210507070611 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null);'
        );
    }
}
