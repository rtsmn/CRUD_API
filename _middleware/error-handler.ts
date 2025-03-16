import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: string | Error, req: Request, res: Response, next: NextFunction): Response => {
    switch (true) {
        case typeof err === 'string':
            const is404: boolean = err.toLowerCase().endsWith('not found');
            const statusCode: number = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        default:
            return res.status(500).json({ message: (err as Error).message });
    }
};

export default errorHandler;