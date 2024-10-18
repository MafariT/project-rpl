import { NextFunction, Request, Response } from "express";
import logger from '../utils/logger';

export function logging(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;

   
    logger.info(`Incoming request: ${method} - ${url}`);

    res.on('finish', () => {
        logger.info(`Response sent: ${method} - ${url} - Status: ${res.statusCode}`);
    });

    next(); 
}
