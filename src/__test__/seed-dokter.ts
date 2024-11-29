import { faker } from "@faker-js/faker";
import { initORM } from "../utils/db";
import { Dokter } from "../models/dokter/dokter.entity";

async function seedDokter(count: number) {
    const db = await initORM({
        debug: false,
    });
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

const dokter_COUNT = process.argv[2] ? parseInt(process.argv[2], 10) : 10;

seedDokter(dokter_COUNT)
    .catch((error) => {
        console.error("Error seeding dokter:", error);
    })
    .finally(() => {
        process.exit(0);
    });
