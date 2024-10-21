import express from "express";
import viewRouter from "./routes/view";
import userRouter from "./routes/user";
import { logging } from "./middlewares/logging";
import { initORM } from "./utils/db";
import cookieParser from "cookie-parser";
import session from "express-session";
import authRouter from "./routes/auth";

const app = express();
const PORT = 3000;

// Initialize database
initORM();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logging);
app.use(cookieParser("secret"));
app.use(
    session({
        secret: "fadlan",
        saveUninitialized: false,
        resave: false,
        cookie: { maxAge: 1000 * 60 }, // ms - second
    }),
);

// View
app.use("/", viewRouter);

// User API
app.use("/api/user", userRouter);

// Auth API
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});
