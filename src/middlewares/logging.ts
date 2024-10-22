import { NextFunction, Request, Response } from "express";
import pino from "pino";

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            levelFirst: true,
            translateTime: "SYS:standard",
        },
    },
});

export function logging(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;

    logger.info(`Incoming request: ${method} - ${url}`);

    res.on("finish", () => {
        logger.info(`Response sent: ${method} - ${url} - Status: ${res.statusCode}`);
    });

    next();
}
