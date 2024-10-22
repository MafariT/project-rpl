import { Router } from "express";
import { createUser, getUser } from "../controllers/userController";

const userRouter = Router();

// /api/user
userRouter.get("/", getUser as any);

userRouter.post("/", createUser as any);

export default userRouter;
