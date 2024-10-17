import { Request, Response } from "express";
import path from "path";

export function homeView(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); 
}

export function createUserView(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '..', 'public', 'createUser.html')); 
}