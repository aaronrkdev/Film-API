import express from "express";
import { config } from "dotenv";
import { prisma, connectDB, disconnectDB } from "./config/db.js";

//import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";

config();
connectDB();
const app = express();

//Body parser midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//handle unhandled promise Rejection (e.g database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection: ", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//handle uncaught exception
process.on("uncaughtException", async (err) => {
  console.error("Uncaught exception: ", err);
  await disconnectDB();
  process.exit(1);
});

//Gaceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
