import {
    BeforeCreate,
    BeforeUpdate,
    Entity,
    EventArgs,
    PrimaryKey,
    Property,
} from "@mikro-orm/core";
import { UserRepository } from "./user.repository";
import z from "zod";
import { hash, verify } from "argon2";

@Entity({ repository: () => UserRepository })
export class User {
    @PrimaryKey()
        id!: number;

    @Property({ nullable: false, hidden: true })
        username!: string;

    @Property({ nullable: false, hidden: true })
        email!: string;

    @Property({ nullable: false, hidden: true })
        password!: string;

    @Property({ nullable: false })
        displayName!: string;

    constructor(username: string, email: string, password: string, displayName: string) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }

    static validFilter = z.enum(["username", "displayName"]);

    // @BeforeCreate()
    // @BeforeUpdate()
    // async hashPassword(args: EventArgs<User>) {
    //     const password = args.changeSet?.payload.password;

    //     if (password) {
    //         this.password = await hash(password);
    //     }
    // }

    // async verifyPassword(password: string) {
    //     return verify(this.password, password);
    // }
}
