import { FastifyInstance } from "fastify";
import FastifyPassport from "@fastify/passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user/user.entity";
import { initORM } from "../utils/db";

FastifyPassport.use(
    "local",
    new LocalStrategy(async (username: string, password: string, done) => {
        try {
            const db = await initORM();
            const user = await db.user.findOne({ username });

            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            const isMatch = await user.verifyPassword(password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }),
);

FastifyPassport.registerUserSerializer(async (user: User) => user.id);

FastifyPassport.registerUserDeserializer(async (id: number) => {
    const db = await initORM();
    return await db.user.findOne({ id });
});

export function configurePassport(fastify: FastifyInstance) {
    fastify.register(require("@fastify/secure-session"), {
        secret: "aowpdjaw0-d120931u2eio12nwdaspoda[siud1[2d102-di1wdasd",
        cookie: { path: "/", httpOnly: true, secure: false, maxAge: 60 * 60 * 24 }, // 1 Day
    });

    fastify.register(FastifyPassport.initialize());
    fastify.register(FastifyPassport.secureSession());
}
