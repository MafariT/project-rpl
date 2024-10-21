import { Request, Response } from "express";
import path from "path";

declare module "express-session" {
    interface SessionData {
        visited: boolean;
    }
}

export function homeView(req: Request, res: Response) {
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 30000, signed: true });
    return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
}

export function createUserView(req: Request, res: Response) {
    return res.sendFile(path.join(__dirname, "..", "public", "createUser.html"));
}

export function userListView(req: Request, res: Response) {
    if (req.signedCookies.hello === "world") {
        return res.sendFile(path.join(__dirname, "..", "public", "usersList.html"));
    }
    return res.redirect("/");
}
