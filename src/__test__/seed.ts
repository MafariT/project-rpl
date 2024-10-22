import { faker } from "@faker-js/faker";
import { initORM } from "../utils/db";
import { Pasien } from "../models/pasien/pasien.entity";

async function seedpasiens(count: number) {
    const db = await initORM({
        debug: false,
    });
    const pasiens: Pasien[] = [];

    for (let i = 0; i < count; i++) {
        const nik = faker.internet.userName();
        const nama = faker.person.fullName();
        const alamat = faker.location.streetAddress();
        const noTel = faker.number.int({ max: 12 });
        const tanggalLahir = faker.date.birthdate().toDateString();
        const jenisKelamin = faker.person.sex();

        const pasien = new Pasien(nik, nama, alamat, noTel, tanggalLahir, jenisKelamin);
        pasiens.push(pasien);
    }

    await db.pasien.getEntityManager().persistAndFlush(pasiens);
    console.log(`${count} pasiens seeded.`);
}

const pasien_COUNT = 100000; // Number of pasiens to seed
seedpasiens(pasien_COUNT)
    .catch((error) => {
        console.error("Error seeding pasiens:", error);
    })
    .finally(() => {
        process.exit(0);
    });
