// errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import HttpException from '../classes/http.exception';
import DAO from '../classes/dao';
import { StatusCodes } from 'http-status-codes';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    let r:DAO<any>
    if(err instanceof HttpException) {
        r = new DAO(err.message,undefined);
        res.status(err.status).json(r);
    }else {
        r = new DAO([err.message || 'Internal Server Error'], undefined);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(r);
    }
};
