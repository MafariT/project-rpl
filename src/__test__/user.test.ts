import { getUser, getUserById, createUser, deleteUser } from "../controllers/user.controller";
import { initORM } from "../utils/db";
import { EntityExistsError, EntityNotFound } from "../utils/erros";
import { ZodError } from "zod";

jest.mock("../utils/db");
const mockDB = {
    user: {
        fetch: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    },
};

beforeEach(() => {
    jest.clearAllMocks();
    (initORM as jest.Mock).mockResolvedValue(mockDB);
});

describe("User Controller", () => {
    describe("getUser", () => {
        it("should fetch users based on filter and value", async () => {
            const mockUsers = [{ id: 1, username: "JohnDoe" }];
            mockDB.user.fetch.mockResolvedValue(mockUsers);

            const request = { query: { filter: "username", value: "John" } } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await getUser(request, reply);

            expect(mockDB.user.fetch).toHaveBeenCalledWith("username", "John");
            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith(mockUsers);
        });

        it("should return 500 on error", async () => {
            mockDB.user.fetch.mockRejectedValue(new Error("Database error"));

            const request = { query: { filter: "username", value: "John" } } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await getUser(request, reply);

            expect(reply.status).toHaveBeenCalledWith(500);
        });
    });

    describe("getUserById", () => {
        it("should fetch a user by ID", async () => {
            const mockUser = { id: 1, username: "JohnDoe" };
            mockDB.user.findOne.mockResolvedValue(mockUser);

            const request = { user: { id: 1 } } as any;
            const reply = { send: jest.fn() } as any;

            await getUserById(request, reply);

            expect(mockDB.user.findOne).toHaveBeenCalledWith(1);
            expect(reply.send).toHaveBeenCalledWith(mockUser);
        });

        it("should return 401 if user ID is not provided", async () => {
            const request = { user: null } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await getUserById(request, reply);

            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
        });

        it("should return 404 if user is not found", async () => {
            mockDB.user.findOne.mockResolvedValue(null);

            const request = { user: { id: 1 } } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await getUserById(request, reply);

            expect(reply.status).toHaveBeenCalledWith(404);
            expect(reply.send).toHaveBeenCalledWith({ message: "User record not found" });
        });
    });

    describe("createUser", () => {
        it("should create a new user", async () => {
            const request = {
                body: { username: "JohnDoe", email: "john@example.com", password: "12345" },
            } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await createUser(request, reply);

            expect(mockDB.user.save).toHaveBeenCalledWith("JohnDoe", "john@example.com", "12345");
            expect(reply.status).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith({
                message: "User JohnDoe successfully created",
            });
        });

        it("should return 400 for validation errors", async () => {
            const request = {
                body: { username: "", email: "", password: "" },
            } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await createUser(request, reply);

            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.send).toHaveBeenCalledWith({
                message: "Validation failed",
                errors: expect.any(Array),
            });
        });

        it("should return 409 if user already exists", async () => {
            mockDB.user.save.mockRejectedValue(new EntityExistsError("User"));

            const request = {
                body: { username: "JohnDoe", email: "john@example.com", password: "12345" },
            } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await createUser(request, reply);

            expect(reply.status).toHaveBeenCalledWith(409);
            expect(reply.send).toHaveBeenCalledWith({ message: "User already exists" });
        });
    });

    describe("deleteUser", () => {
        it("should delete a user by ID", async () => {
            const request = { params: { id: 1 } } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await deleteUser(request, reply);

            expect(mockDB.user.delete).toHaveBeenCalledWith(1);
            expect(reply.status).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith({
                message: "User 1 successfully deleted",
            });
        });

        it("should return 400 if ID is not a number", async () => {
            const request = { params: { id: "abc" } } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await deleteUser(request, reply);

            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.send).toHaveBeenCalledWith({ message: "User abc must be a number" });
        });

        it("should return 404 if user is not found", async () => {
            mockDB.user.delete.mockRejectedValue(new EntityNotFound(1));

            const request = { params: { id: 99 } } as any;
            const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;

            await deleteUser(request, reply);

            expect(reply.status).toHaveBeenCalledWith(404);
            expect(reply.send).toHaveBeenCalledWith({ message: "1 Not Found" });
        });
    });
});
