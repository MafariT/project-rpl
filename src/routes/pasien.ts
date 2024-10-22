import { Router } from "express";
import { createPasien, getPasien } from "../handlers/pasienHandler";

const userRouter = Router();

// /api/user
userRouter.get("/", getPasien as any);

userRouter.post("/", createPasien as any);

export default userRouter;
