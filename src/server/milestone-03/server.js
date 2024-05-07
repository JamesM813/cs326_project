import express from "express";
import * as db from "./db.js";
import * as http from "http";
import * as url from "url";

const app = express();
const port = 3260;

http.createServer(basicServer).listen(port, () => {
    console.log(`Server started on port ${port}`);
  });