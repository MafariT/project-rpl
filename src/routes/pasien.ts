import { Router } from "express";
import { createPasien, getPasien } from "../controllers/pasienController";

const pasienRouter = Router();

// /api/pasien
pasienRouter.get("/", getPasien as any);

pasienRouter.post("/", createPasien as any);

export default pasienRouter;
