import express from "express";
import app from "./src/app";
const cors = require("cors");
import "dotenv/config";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server runnig on port ${port}`);
});
