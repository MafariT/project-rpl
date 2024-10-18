import { createLogger, format, transports } from 'winston';
import * as fs from 'fs';
import * as path from 'path';

const logDir = path.join(__dirname, '../../log');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: 'info',
    format: format.simple(), 
    transports: [
        new transports.Console(), 
        new transports.File({ filename: path.join(logDir, 'log.log') }) 
    ],
});

export default logger;
