import { BeforeCreate, BeforeUpdate, Entity, EventArgs, PrimaryKey, Property } from "@mikro-orm/mysql";
import { UserRepository } from "./user.repository";
import { hash, verify } from "argon2";

@Entity({ repository: () => UserRepository })
export class User {
    @PrimaryKey({ autoincrement: true })
        id!: number;
    
    @Property({ nullable: false })
        username!: string;

    @Property({ nullable: false })
        email!: string;

    @Property({ nullable: false, hidden: true})
        password!: string;

    @Property({ default: "pasien" })
        role!: string;

    @Property({ onCreate: () => new Date() })
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
