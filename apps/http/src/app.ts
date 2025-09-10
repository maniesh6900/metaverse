import express from 'express';
const app = express();
import cookieparser from "cookie-parser";
import cors from "cors";

app.use(express.json());
app.use(cookieparser());
app.use(cors({origin: "*"}));

// importing routes 

import UserRouter from "./routes/user-router";
import AdminRouter from "./routes/admin-router";

// initsalizing router

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);


export { app };