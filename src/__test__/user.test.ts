import Fastify from "fastify";
import { getUser, getUserById, createUser, deleteUser } from "../controllers/user.controller";
import { initORM } from "../utils/db";
import { EntityExistsError, EntityNotFound } from "../utils/erros";
import { User } from "../models/user/user.entity";

jest.mock("../utils/db", () => ({
    initORM: jest.fn(),
}));

jest.mock("../models/user/user.entity", () => ({
    User: jest.fn(),
}));

jest.mock("../utils/erros", () => ({
    EntityExistsError: jest.fn(),
    EntityNotFound: jest.fn(),
}));

describe("User API tests", () => {
    let fastify: any;

    beforeEach(() => {
        fastify = Fastify();
        fastify.get("/admin", getUser);
        fastify.get("/", getUserById);
        fastify.post("/", createUser);
        fastify.delete("/:id", deleteUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("GET /api/user/admin should return all users", async () => {
        const mockDb = {
            user: {
                fetch: jest.fn().mockResolvedValue([
                    { id: 1, username: "user1" },
                    { id: 2, username: "user2" },
                ]),
            },
        };
        (initORM as jest.Mock).mockResolvedValue(mockDb);

        const response = await fastify.inject({
            method: "GET",
            url: "/admin",
        });

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([
            { id: 1, username: "user1" },
            { id: 2, username: "user2" },
        ]);
    });

    // test("GET /api/user should return user by session ID", async () => {
    //   const mockDb = { user: { findOne: jest.fn().mockResolvedValue({ id: 1, username: "user1" }) } };
    //   (initORM as jest.Mock).mockResolvedValue(mockDb);

    //   const request = {
    //     method: "GET",
    //     url: "/",
    //     headers: { authorization: "Bearer valid-token" },
    //   };

    //   const response = await fastify.inject(request);

    //   expect(response.statusCode).toBe(200);
    //   expect(JSON.parse(response.body)).toEqual({ id: 1, username: "user1" });
    // });

    test("POST /api/user should create a new user", async () => {
        const mockDb = { user: { save: jest.fn().mockResolvedValue({ id: 1, username: "user1" }) } };
        (initORM as jest.Mock).mockResolvedValue(mockDb);

        const request = {
            method: "POST",
            url: "/",
            payload: { username: "user1", email: "user1@example.com", password: "password123" },
        };

        const response = await fastify.inject(request);

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.body).message).toBe("User user1 successfully created");
    });

    test("POST /api/user should return validation error", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/",
            payload: { username: "", email: "user1@example.com", password: "password123" },
        });

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe("Validation failed");
    });

    test("DELETE /api/user/:id should delete a user by ID", async () => {
        const mockDb = { user: { delete: jest.fn().mockResolvedValue({}) } };
        (initORM as jest.Mock).mockResolvedValue(mockDb);

        const response = await fastify.inject({
            method: "DELETE",
            url: "/1",
        });

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.body).message).toBe("User 1 successfully deleted");
    });

    test("DELETE /api/user/:id should return not found error", async () => {
        const mockDb = { user: { delete: jest.fn().mockRejectedValue(new EntityNotFound(1)) } };
        (initORM as jest.Mock).mockResolvedValue(mockDb);

        const response = await fastify.inject({
            method: "DELETE",
            url: "/1",
        });

        expect(response.statusCode).toBe(404);
        // expect(JSON.parse(response.body).message).toBe("1 Not Found");
    });
});
