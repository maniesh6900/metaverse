import { ApiError } from "../utils/ApiError";
import { APiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { client } from "@repo/db/client";
import { AdminSchema, CreateAvatarSchama, CreateElementSchema, CreateMApELementSechma, CreateMapSchema, CreateSpaceElementSchema, CreateSpaceSchema } from "../types";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const createAvater = asyncHandler(async (req: Request, res: Response) => {
    const parsedData = CreateAvatarSchama.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError(411, "data is not found");
    }
    const existsImage = await client.avatar.findFirst({
        where: {
            imageUrl: parsedData.data?.imageUrl,
        },
    });
    if (existsImage) {
        throw new ApiError(409, "avatar is with this image already exist");
    }

    const avatar = await client.avatar.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl,
        },
    });

    if (!avatar) {
        throw new ApiError(500, "Couldn't create Avatar server having some error please Try again some time");
    }

    res.json(
        new APiResponse(200, avatar, "Avatar created succesfully"),
    );


});

export const createSpace = asyncHandler(async (req: Request | any, res: Response) => {
    const parsedData = CreateSpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError(411, "data not found");
    }
    console.log(req.user);


    const space = await client.space.create({
        data: {
            name: parsedData.data.name,
            width: parsedData.data.width,
            height: parsedData.data.height,
            thumbnail: parsedData.data.thumbnail,
            creatorId: req.user,// user middleware
        },
    });
    if (!space) {
        throw new ApiError(500, "server having some problem while create new space, Please try after some time ");
    }
    res.json(
        new APiResponse(200, space, "new space created")
    )
});

export const GetSpaces = asyncHandler(async (req: Request | any, res: Response) => {

    const spaces = await client.space.findMany();
    if (!spaces) {
        throw new ApiError(500, "server having some problem Please try after sometime ");
    }
    res.json(
        new APiResponse(200, spaces, "all spcaces fatched succefully")
    )
});

export const createSpaceElement = asyncHandler(async (req: Request, res: Response) => {

    const { spaceId } = req.params;

    const parsedData = CreateSpaceElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError(411, "data not found");
    }

    const spaceElement = await client.spaceElements.create({
        data: {
            x: parsedData.data.x,
            y: parsedData.data.y,
            elementId: parsedData.data.elementId,// Todo 
            spaceId,
        },
    });

    if (!spaceElement) {
        throw new ApiError(500, "server is having som,e error while creating getting element");
    }


});

export const CreateElement = asyncHandler(async (req: Request, res: Response) => {
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError(411, "data not found");
    }

    const existingELement = await client.element.findFirst({
        where: {
            imageUrl: parsedData.data.imageUrl,
        },
    });
    if (existingELement) {
        throw new ApiError(411, "element with this image already exists");
    }

    const element = await client.element.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl,
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
        },
    });

    if (!element) {
        throw new ApiError(500, "server's having some errror please try after some time");
    }

    res.json(
        new APiResponse(200, element, "new Item has been created successfully"),
    );
});

export const createMap = asyncHandler(async (req: Request, res: Response) => {
    const parsedData = CreateMapSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError(411, "data not found");
    }

    const existedMap = await client.map.findFirst({
        where: {
            name: parsedData.data.name,
        },
    });
    if (existedMap) {
        throw new ApiError(411, "Map name is already tekken");
    }

    const map = await client.map.create({
        data: {
            name: parsedData.data.name,
            width: parsedData.data.width,
            height: parsedData.data.height,
            thumbnail: parsedData.data.thumbnail,
        },
    });
    if (map) {
        throw new ApiError(500, "server is having some problem please try after some time");
    }

    res.json(
        new APiResponse(200, map, "new Map created successfullly"),
    );
});

export const createMapElement = asyncHandler(async (req: Request, res: Response) => {
    const { mapId } = req.params;
    const parsedData = CreateMApELementSechma.safeParse(req.body);

    const x = Math.random() * 10;
    const y = Math.random() * 10;

    if (!parsedData.data?.elementId) {
        throw new ApiError(411, "No Element Found with THis Id");
    }

    const mapELement = await client.mapElements.create({
        data: {
            mapId,
            x,
            y,
            elementId: parsedData.data?.elementId,
        },
    });

    res.json(
        new APiResponse(200, { mapELement }, "new Map Element has been created"),
    );
});
