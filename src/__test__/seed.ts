import { faker } from "@faker-js/faker";
import { initORM } from "../utils/db";
import { User } from "../models/user/user.entity";
import { Informasi } from "../models/informasi/informasi.entity";
import { Dokter } from "../models/dokter/dokter.entity";

async function seedUsers(count: number) {
    const db = await initORM({ debug: false });
    const users: User[] = [];

    for (let i = 0; i < count; i++) {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = "12345678";

        const user = new User(username, email, password);
        users.push(user);
    }

    await db.user.getEntityManager().persistAndFlush(users);
    console.log(`${count} users seeded.`);
}

async function seedInformasi(count: number) {
    const db = await initORM({ debug: false });
    const informasiList: Informasi[] = [];

    for (let i = 0; i < count; i++) {
        const foto = faker.image.url();
        const judul = faker.lorem.sentence();
        const isi = faker.lorem.paragraph({ min: 1, max: 1000 });

        const informasi = new Informasi(foto, judul, isi);
        informasiList.push(informasi);
    }

    await db.informasi.getEntityManager().persistAndFlush(informasiList);
    console.log(`${count} informasi seeded.`);
}

async function seedDokter(count: number) {
    const db = await initORM({ debug: false });
    const dokterList: Dokter[] = [];

    for (let i = 0; i < count; i++) {
        const nama = faker.person.fullName();
        const poliKlinik = faker.helpers.arrayElement(["Poli Umum", "Poli Gigi", "Poli Anak", "Poli Jantung"]);
        const jamMulai = faker.date.recent().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const jamSelesai = faker.date.recent().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const dokter = new Dokter(nama, poliKlinik, jamMulai, jamSelesai);
        dokterList.push(dokter);
    }

    await db.dokter.getEntityManager().persistAndFlush(dokterList);
    console.log(`${count} dokter seeded.`);
}

async function runSeeder() {
    const schema = process.argv[2];
    const count = process.argv[3] ? parseInt(process.argv[3], 10) : 10;

    switch (schema) {
    case "user":
        await seedUsers(count);
        break;
    case "informasi":
        await seedInformasi(count);
        break;
    case "dokter":
        await seedDokter(count);
        break;
    default:
        console.error("usage: seed [schema] [count] \nschema -> user, informasi, dokter");
        process.exit(1);
    }

    process.exit(0);
}

runSeeder().catch((error) => {
    console.error("Error seeding:", error);
    process.exit(1);
});
