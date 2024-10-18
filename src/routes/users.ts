import { Router } from "express";
import { createUser, getUsers } from "../handlers/usersHandler";

const userRouter = Router();

// /api/users
userRouter.get('/', getUsers as any);

userRouter.post('/', createUser as any)

export default userRouter;
