import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const userMiddleware = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
    const token = req.cookies?.token
    console.log(token);

    if (!token) {
        throw new ApiError(411, "Unauthorized");
    }


    const decorded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decorded) {
        throw new ApiError(400, "token has failed please login again and retry");
    }
    console.log(decorded);

    // @ts-ignore
    if (decorded.userId) {
        // @ts-ignore
        req.user = decorded.userId;
        next();
    } else {
        throw new ApiError(400, "You are not logged in");
    }



});
