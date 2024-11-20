import { faker } from "@faker-js/faker";
import { initORM } from "../utils/db";
import { User } from "../models/user/user.entity";

async function seedusers(count: number) {
    const db = await initORM({
        debug: false,
    });
    const users: User[] = [];

    for (let i = 0; i < count; i++) {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        const user = new User(username, email, password);
        users.push(user);
    }

    await db.user.getEntityManager().persistAndFlush(users);
    console.log(`${count} users seeded.`);
}

const user_COUNT = process.argv[2] ? parseInt(process.argv[2], 10) : 10;
seedusers(user_COUNT)
    .catch((error) => {
        console.error("Error seeding users:", error);
    })
    .finally(() => {
        process.exit(0);
    });
