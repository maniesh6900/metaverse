import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { APiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {client } from "@repo/db/client" ;
import { UserSigninSchema, UserSignupSchema } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSignup = asyncHandler(async (req : Request, res : Response) => {
    const parsedData = UserSignupSchema.safeParse(req.body);
    if(!parsedData.success) {
        throw new ApiError(411, "Invalid user data");
    }
    const existingUser = await client.user.findFirst({
        where : {
            username : parsedData.data.username,
        },
    });
  
    if(existingUser) {
        throw new ApiError(411, "username already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(parsedData.data.password, salt);

    const user = await client.user.create({
        data : {
            username : parsedData.data.username,
            password : hashedPassword,
            role : parsedData.data.role,
        },
    });
    if(!user) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    const token = jwt.sign({
        useId : user.id,
    },
    process.env.JWT_SECRET as string,
    );

    res
    .cookie("token", token, {secure : true, httpOnly : true})
    .json(new APiResponse(200, {user}, "User created successfully"));
    
});

export const Usesignin = asyncHandler(async (req : Request, res : Response) => {
    const parsedData = UserSigninSchema.safeParse(req.body);
    if(!parsedData.success) {
        throw new ApiError(411, "Invalid user data");
    }
    const user = await client.user.findFirst({
        where : {
            username : parsedData.data.username,
        },
    });

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const hashedPassword = bcrypt.compare(parsedData.data.password, user.password);
    if(!hashedPassword) {
        throw new ApiError(411, "Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);

    res
    .cookie("token", token, {secure : true, httpOnly : true})
    .json(new APiResponse(200, {user: user, token}, "User logged in successfully"));
});

export const getSpaceById = asyncHandler(async (req : Request, res : Response) => {
    const spaceid = req.params.id;
    
    if(spaceid == undefined) {
        throw new ApiError(411, "space id is undefined");
    }

    const space = await client.space.findFirst({
        where : {
            id : spaceid,
        },
    });

    if(space) {
        res
        .json(new APiResponse(200, {space}, "fatch succefully"));
    }
    
});