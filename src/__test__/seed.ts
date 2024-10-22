import { faker } from "@faker-js/faker";
import { initORM } from "../utils/db";
import { Pasien } from "../models/pasien.entity";

async function seedUsers(count: number) {
    const db = await initORM({
        debug: false,
    });
    const users: Pasien[] = [];

    for (let i = 0; i < count; i++) {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const displayName = faker.person.fullName();
        const password = faker.internet.password({ length: 5, memorable: true });

        const user = new Pasien(username, email, password, displayName);
        users.push(user);
    }

    await db.user.getEntityManager().persistAndFlush(users);
    console.log(`${count} users seeded.`);
}

const USER_COUNT = 1000000; // Number of users to seed
seedUsers(USER_COUNT)
    .catch((error) => {
        console.error("Error seeding users:", error);
    })
    .finally(() => {
        process.exit(0);
    });
