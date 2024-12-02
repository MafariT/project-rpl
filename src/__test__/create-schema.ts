import { MikroORM } from "@mikro-orm/mysql";
import dotenv from "dotenv";
import config from "../utils/mikro-orm.config";

dotenv.config();

(async () => {
    const orm = await MikroORM.init({
        ...config,
    });
    const generator = orm.schema;

    await generator.dropSchema();
    await generator.createSchema();

    await orm.close(true);
})();
