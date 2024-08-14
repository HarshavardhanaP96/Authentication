import mongoose from "mongoose";

async function connectMongodb(url) {
  return mongoose
    .connect(url)
    .then(() => console.log("connected to db"))
    .catch((err) => console.log("Failed to connect to db:", err));
}

export default connectMongodb;
