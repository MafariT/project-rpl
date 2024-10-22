import express from "express";
import pasienRouter from "./routes/pasien";
import { logging } from "./middlewares/logging";
import { initORM } from "./utils/db";
import cookieParser from "cookie-parser";
import session from "express-session";
import userRouter from "./routes/user";

const app = express();
const PORT = 3000;

// Initialize database
initORM();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    express.static("./src/public", {
        extensions: ["html"],
    }),
);

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

app.use("/api/pasien", pasienRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});
