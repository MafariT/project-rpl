import { Request, response, Response } from "express";
import path from "path";

export function homeView(req: Request, res: Response) {
    res.cookie("hello", "world", { maxAge: 10000 });
    return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
}

export function createUserView(req: Request, res: Response) {
    return res.sendFile(path.join(__dirname, "..", "public", "createUser.html"));
}

export function userListView(req: Request, res: Response) {
    return res.sendFile(path.join(__dirname, "..", "public", "usersList.html"));
}
