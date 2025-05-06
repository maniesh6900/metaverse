import express from 'express';
const app = express();
import cookieparser from "cookie-parser";

app.use(express.json());
app.use(cookieparser());

// importing routes 

import UserRouter from "./routes/user-router";

// initsalizing router

app.use("/api/v1/user", UserRouter);


export {app};