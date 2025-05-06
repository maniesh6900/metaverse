import dotenv from "dotenv";
dotenv.config({
    path : "./.env",
});

import { app } from "./app";

app.listen(3000);
