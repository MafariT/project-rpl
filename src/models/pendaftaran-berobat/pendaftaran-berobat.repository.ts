import { EntityRepository } from "@mikro-orm/mysql";
import { PendaftaranBerobat } from "./pendaftaran-berobat.entity";
import { EntityExistsError } from "../../utils/erros";
import z from "zod";

export class PendaftaranBerobatRepository extends EntityRepository<PendaftaranBerobat> {
    static validFilter = z.enum(["idPendaftaran"]);
    async fetch(filter?: string, value?: string): Promise<PendaftaranBerobat[]> {
        if (filter && value && PendaftaranBerobatRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async save(
        nik: string,
        nama: string,
        jenisKelamin: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        tanggalPengajuan: string,
        poli: string,
        keluhan: string,
        namaDokter: string,
        jam: string,
        jenisPembayaran: string,
        totalPembayaran: string,
        fk: number,
    ): Promise<void> {
        // if (await this.exists(nik)) {
        //     throw new EntityExistsError(nik);
        // }

        const newPendaftaranBerobat = new PendaftaranBerobat(
            nik,
            nama,
            jenisKelamin,
            alamat,
            noTel,
            tanggalLahir,
            tanggalPengajuan,
            poli,
            keluhan,
            namaDokter,
            jam,
            jenisPembayaran,
            totalPembayaran,
            fk,
        );
        this.create(newPendaftaranBerobat);
        await this.em.flush();
    }

    private async exists(nik: string): Promise<boolean> {
        const count = await this.qb().where({ nik }).getCount();
        return count > 0;
    }
}
