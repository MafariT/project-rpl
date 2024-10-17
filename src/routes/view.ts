import { Router } from "express";
import { createUserView, homeView } from "../handlers/viewHandler";

const navRouter = Router();

// /
navRouter.get('/', homeView);

navRouter.get('/createUser', createUserView);

export default navRouter;
