import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import routes from "./routes";
import { initDB } from "./db";

dotenv.config();

initDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(routes.objectRouter);
app.use(routes.objectVoteRouter);
app.use(routes.userRouter);

app.get("/", (req, res) => {
    res.send("EtcMap Server is Up!");
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});