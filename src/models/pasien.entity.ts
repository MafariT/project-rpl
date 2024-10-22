import {
    BeforeCreate,
    BeforeUpdate,
    Entity,
    EventArgs,
    PrimaryKey,
    Property,
} from "@mikro-orm/core";
import { PasienRepository } from "./pasien.repository";
import z from "zod";
import { hash, verify } from "argon2";

@Entity({ repository: () => PasienRepository })
export class Pasien {
    @PrimaryKey()
        nik!: string;

    @Property({ nullable: false })
        fullName!: string;

    @Property({ nullable: false })
        alamat!: string;

    @Property({ nullable: false })
        noTel!: number;

    @Property({ nullable: false })
        tanggalLahir!: Date;

    @Property({ nullable: false })
        jenisKelamin!: string;

    @Property({ nullable: false })
        username!: string;

    @Property({ nullable: false })
        password!: string;

    @Property({ nullable: false })
        email!: string;
        
    constructor(
        nik: string,
        fullName: string,
        alamat: string,
        noTel: number,
        tanggalLahir: Date,
        jenisKelamin: string,
        username: string,
        password: string,
        email: string
    ) {
        this.nik = nik;
        this.fullName = fullName;
        this.alamat = alamat;
        this.noTel = noTel;
        this.tanggalLahir = tanggalLahir
        this.jenisKelamin = jenisKelamin
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static validFilter = z.enum(["username", "displayName"]);

    @BeforeCreate()
    @BeforeUpdate()
    async hashPassword(args: EventArgs<Pasien>) {
        const password = args.changeSet?.payload.password;

        if (password) {
            this.password = await hash(password);
        }
    }

    async verifyPassword(password: string) {
        return verify(this.password, password);
    }
}
