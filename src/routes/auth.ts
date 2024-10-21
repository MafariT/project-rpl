import { Request, Response, Router } from "express";

const authRouter = Router();

// /api/auth
authRouter.get("/", (req: Request, res: Response) => {
    const { body } = req;
});

export default authRouter;
