import z from "zod";

export const UserSignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["Admin", "User"]),
});

export const UserSigninSchema = z.object({
    username: z.string(),
    password: z.string(),
});
export const AdminSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const CreateAvatarSchama = z.object({
    name: z.string(),
    imageUrl: z.string(),
});

export const CreateSpaceSchema = z.object({
    name: z.string(),
    width: z.number(),
    height: z.number(),
    thumbnail: z.string().url(),
});

export const CreateSpaceElementSchema = z.object({
    x: z.number(),
    y: z.number(),
    elementId: z.string(),
});

export const CreateElementSchema = z.object({
    name: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(),
    imageUrl: z.string().url(),
});

export const CreateMapSchema = z.object({
    name: z.string(),
    width: z.number(),
    height: z.number(),
    thumbnail: z.string(),
    x: z.number(),
    y: z.number(),
});

export const CreateMApELementSechma = z.object({
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
});
