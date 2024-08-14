import express from "express";
import authRouter from "./routers/auth.js";
import connectMongodb from "./connection.js";

const app = express();
const PORT = 3000;

app.use(express.json());

connectMongodb(process.env.DATABASE_URL, { dbName: "Interview_Test" }); //url

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
