// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./Config/db.js");
const userRouter = require("./Routes/AuthRoute.js");
const courseRouter = require("./Routes/CourseRoute.js");
const mediaRouter = require("./Routes/mediaRoute.js");
const paymentGatewayRouter = require("./Routes/purchaseCourseRoute.js");
const progressRoute = require("./Routes/progressRoute.js");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://localhost:5173",
      "https://koursify.vercel.app", // MY VERCEL-FRONTEND URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Custom-Header"],
    credentials: true,
  })
);

const port = process.env.PORT || 5000;
const _dirname = path.resolve();

app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/media", mediaRouter);
app.use("/api/purchase", paymentGatewayRouter);
app.use("/api/progress", progressRoute);
app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});
const startServer = async () => {
  console.log("🔄 Attempting to connect to the database...");
  await connectToDb();

  app.listen(port, () => {
    console.log(`🚀 Server is up and running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exitCode = 1;
});
