import { faker } from "@faker-js/faker";
import { initORM } from "../utils/db";
import { Informasi } from "../models/informasi/informasi.entity";

async function seedInformasi(count: number) {
    const db = await initORM({
        debug: false,
    });
    const informasiList: Informasi[] = [];

    for (let i = 0; i < count; i++) {
        const foto = faker.image.url();
        const judul = faker.lorem.sentence();
        const isi = faker.lorem.paragraph();

        const informasi = new Informasi(foto, judul, isi);
        informasiList.push(informasi);
    }

    await db.informasi.getEntityManager().persistAndFlush(informasiList);
    console.log(`${count} informasi seeded.`);
}

const informasi_COUNT = process.argv[2] ? parseInt(process.argv[2], 10) : 10;

seedInformasi(informasi_COUNT)
    .catch((error) => {
        console.error("Error seeding informasi:", error);
    })
    .finally(() => {
        process.exit(0);
    });
