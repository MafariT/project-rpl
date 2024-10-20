import express from "express";
import viewRouter from "./routes/view";
import userRouter from "./routes/users";
import { logging } from "./middlewares/logging";
import { initORM } from "./utils/db";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;

// Initialize database
initORM();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logging);
app.use(cookieParser());

// View
app.use("/", viewRouter);

// REST API
app.use("/api/users", userRouter);

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});
