/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import cors from "cors";

//require Routes
import authRouter from "./routes/authRoutes";
import fileRouter from "./routes/fileRoutes";
const awsRouter = require("./routes/awsRoutes");
const emailRouter = require("./routes/emailRoutes");
const ecommerceRouter = require("./routes/ecommerceRoutes");
const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/file", fileRouter);
app.use("/aws", awsRouter);
app.use("/email", emailRouter);
app.use("/", ecommerceRouter);

export default app;
