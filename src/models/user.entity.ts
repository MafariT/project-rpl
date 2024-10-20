import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { UserRepository } from "./user.repository";
import z from "zod";

@Entity({ repository: () => UserRepository })
export class User {
    @PrimaryKey()
        id!: number;

    @Property()
        username!: string;

    @Property()
        displayName!: string;

    constructor(username: string, displayName: string) {
        this.username = username;
        this.displayName = displayName;
    }

    static validFilter = z.enum(["username", "displayName"]);
}
