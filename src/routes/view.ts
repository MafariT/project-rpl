import { Router } from "express";
import { createUserView, homeView, userListView } from "../handlers/viewHandler";

const viewRouter = Router();

// /
viewRouter.get("/", homeView);

viewRouter.get("/createUser", createUserView);

viewRouter.get("/userlist", userListView);

export default viewRouter;
