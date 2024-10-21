import { MikroORM } from "@mikro-orm/mysql";
import { User } from "../models/user.entity";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    const orm = await MikroORM.init({
        entities: [User],
        dbName: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    const generator = orm.schema;

    const dropDump = await generator.getDropSchemaSQL();
    console.log(dropDump);

    const createDump = await generator.getCreateSchemaSQL();
    console.log(createDump);

    const updateDump = await generator.getUpdateSchemaSQL();
    console.log(updateDump);

    //   // there is also `generate()` method that returns drop + create queries
    //   const dropAndCreateDump = await generator.
    //   console.log(dropAndCreateDump);

    // or you can run those queries directly, but be sure to check them first!
    await generator.dropSchema();
    await generator.createSchema();
    await generator.updateSchema();

    // in tests it can be handy to use those:
    await generator.refreshDatabase(); // ensure db exists and is fresh
    await generator.clearDatabase(); // removes all data

    await orm.close(true);
})();
