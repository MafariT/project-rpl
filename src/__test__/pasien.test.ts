import { FastifyReply, FastifyRequest } from "fastify";
import { getPasien, getPasienById, createPasien, getPasienByUser, deletePic } from "../controllers/pasien.controller";
import { initORM } from "../utils/db";

jest.mock("../utils/db");
let reply: FastifyReply;
const mockDB = {
    pasien: {
        fetch: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    },
};
beforeEach(() => {
    jest.clearAllMocks();
    (initORM as jest.Mock).mockResolvedValue(mockDB);
    reply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as any;
});

describe("Pasien Handlers", () => {
    describe("getPasien", () => {
        it("should return 200 with pasiens list", async () => {
            mockDB.pasien.fetch.mockResolvedValue([{ id: 1, nama: "John Doe" }]);
            const request = { query: { filter: "nama", value: "John" } } as any;

            await getPasien(request, reply);

            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith([{ id: 1, nama: "John Doe" }]);
        });

        it("should return 500 on internal error", async () => {
            mockDB.pasien.fetch.mockRejectedValue(new Error("DB Error"));
            const request = { query: {} } as any;

            await getPasien(request, reply);

            expect(reply.status).toHaveBeenCalledWith(500);
            expect(reply.send).toHaveBeenCalledWith("Internal Server Error");
        });
    });

    describe("getPasienById", () => {
        it("should return 200 with pasien data", async () => {
            mockDB.pasien.findOne.mockResolvedValue({ id: 1, nama: "John Doe" });
            const request = { params: { id: 1 }, user: { id: 123 } } as any;

            await getPasienById(request, reply);

            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({ id: 1, nama: "John Doe" });
        });

        it("should return 404 if pasien not found", async () => {
            mockDB.pasien.findOne.mockResolvedValue(null);
            const request = { params: { id: 99 }, user: { id: 123 } } as any;

            await getPasienById(request, reply);

            expect(reply.status).toHaveBeenCalledWith(404);
            expect(reply.send).toHaveBeenCalledWith({ message: "pasien record not found" });
        });

        it("should return 401 if unauthorized", async () => {
            const request = { params: { id: 1 }, user: null } as any;

            await getPasienById(request, reply);

            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
        });
    });

    describe("createPasien", () => {
        it("should return 201 when pasien is created successfully", async () => {
            const request = {
                user: { id: 123 },
                parts: jest.fn().mockReturnValue([
                    { type: "field", fieldname: "nama", value: "John Doe" },
                    { type: "field", fieldname: "nik", value: "1234567890123456" },
                ]),
            } as any;

            await createPasien(request, reply);

            expect(reply.status).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith({
                message: "Pasien John Doe successfully created",
            });
        });

        it("should return 400 if validation fails", async () => {
            const request = {
                user: { id: 123 },
                parts: jest.fn().mockReturnValue([
                    { type: "field", fieldname: "nama", value: "" }, // Invalid
                ]),
            } as any;

            await createPasien(request, reply);

            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({ message: "Validation failed" }));
        });

        it("should return 401 if unauthorized", async () => {
            const request = { user: null } as any;

            await createPasien(request, reply);

            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
        });
    });

    describe("getPasienByUser", () => {
        it("should return 200 with pasien data", async () => {
            mockDB.pasien.findOne.mockResolvedValue({ id: 1, nama: "John Doe" });
            const request = { user: { id: 123 } } as any;

            await getPasienByUser(request, reply);

            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({ id: 1, nama: "John Doe" });
        });

        it("should return 404 if pasien not found", async () => {
            mockDB.pasien.findOne.mockResolvedValue(null);
            const request = { user: { id: 123 } } as any;

            await getPasienByUser(request, reply);

            expect(reply.status).toHaveBeenCalledWith(404);
            expect(reply.send).toHaveBeenCalledWith({ message: "Pasien record not found" });
        });

        it("should return 401 if unauthorized", async () => {
            const request = { user: null } as any;

            await getPasienByUser(request, reply);

            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
        });
    });

    describe("deletePic", () => {
        it("should return 200 when picture is deleted", async () => {
            mockDB.pasien.findOne.mockResolvedValue({
                id: 1,
                fotoProfil: "profile.jpg",
                nama: "John Doe",
                nik: "1234567890123456",
                jenisKelamin: "Male",
                alamat: "Address",
                noTel: "081234567890",
                tanggalLahir: "1990-01-01",
                fk: 123,
            });
            const request = { user: { id: 123 } } as any;

            await deletePic(request, reply);

            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({ message: "Picture successfully deleted" });
        });

        it("should return 404 if pasien not found", async () => {
            mockDB.pasien.findOne.mockResolvedValue(null);
            const request = { user: { id: 123 } } as any;

            await deletePic(request, reply);

            expect(reply.status).toHaveBeenCalledWith(404);
            expect(reply.send).toHaveBeenCalledWith({ message: "Pasien record not found" });
        });

        it("should return 401 if unauthorized", async () => {
            const request = { user: null } as any;

            await deletePic(request, reply);

            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({ message: "Unauthorized" });
        });
    });
});
