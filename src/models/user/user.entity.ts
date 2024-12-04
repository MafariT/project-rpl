import { BeforeCreate, BeforeUpdate, Entity, EventArgs, PrimaryKey, Property } from "@mikro-orm/mysql";
import { UserRepository } from "./user.repository";
import { hash, verify } from "argon2";

@Entity({ repository: () => UserRepository })
export class User {
    @PrimaryKey({ autoincrement: true })
        id!: number;

    @Property({ nullable: false, length: 64})
        username!: string;

    @Property({ nullable: false, length: 128})
        email!: string;

    @Property({ nullable: false, hidden: true, length: 255 })
        password!: string;

    @Property({ default: "pasien", length: 8 })
        role!: string;

    @Property({ nullable: true })
        resetToken?: string | null;

    @Property({ nullable: true })
        resetTokenExpires?: Date | null;

    @Property({ onCreate: () => new Date(), hidden: true })
        created!: Date;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    @BeforeCreate()
    @BeforeUpdate()
    async hashPassword(args: EventArgs<User>) {
        const password = args.changeSet?.payload.password;

        if (password) {
            this.password = await hash(password);
        }
    }

    async verifyPassword(password: string) {
        return verify(this.password, password);
    }
}
