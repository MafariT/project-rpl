import { Router } from "express";
import { createUser, getUsers } from "../handlers/users";

const userRouter = Router();

// /api/users
userRouter.get('/', getUsers as any);

userRouter.post('/', createUser)

export default userRouter;
