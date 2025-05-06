import { NextFunction, Request, Response } from "express";

export const asyncHandler = (promiseHanddler : Function) => {
    return (req : Request, res : Response, next : NextFunction)=> {
        Promise.resolve(promiseHanddler(req, res, next)).catch((err : any) => next(err));
    };
}