import { Request, Response } from "express";
import db from "../utils/db";
import { UserDto } from "../dtos/User.dto";
import { QueryParams } from "../types/query-params";

// const mockUser = [
//     { id: 1, username: "ro", displayName: "Ro" },
//     { id: 2, username: "ro1", displayName: "Ro1" },
//     { id: 3, username: "alice", displayName: "Alice" },
//     { id: 4, username: "bob", displayName: "Bob" },
//     { id: 5, username: "charlie", displayName: "Charlie" },
//     { id: 6, username: "dave", displayName: "Dave" },
//     { id: 7, username: "eve", displayName: "Eve" },
//     { id: 8, username: "mallory", displayName: "Mallory" },
//     { id: 9, username: "trent", displayName: "Trent" },
//     { id: 10, username: "victor", displayName: "Victor" }
// ];


export async function getUsers(req: Request<{}, {}, {}, QueryParams>, res: Response) {
    const {
        query: { filter, value}
    } = req;

    try {
        let sql = 'SELECT * FROM users';
        const params: string[] = [];
        
        if (filter && value) {
            sql += ` WHERE ${filter} LIKE ?`;
            params.push(`%${value}%`);
        }
    
        const [users] = await db.execute(sql, params);
        res.send(users);
    } catch (error) {
        console.log(error);
        res.sendStatus(500); // Internal server error
    }
}


export async function createUser(req: Request<{}, {}, UserDto>, res: Response) {
    const { username, displayName } = req.body;

    try {
        await db.execute('INSERT INTO users (username, displayName) VALUES (?, ?)', [username, displayName]);
        res.status(201).send(`User ${username} successfully created`);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal Server Error
    }
}