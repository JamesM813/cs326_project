import express from "express";
import * as db from "./db.js";
import * as http from "http";
import * as url from "url";

const app = express();
const port = 3260;

/* 
So when we do have to get the questions, I assigned an ID system to which we
can map id -> topic, saving us a lot of computational time. For now I designed it
as follows:

000 Tutorial Question
001 - 020 History
021 - 040 Science
041 - 060 Music
061 - 080 Pop Culture
081 - 100 Math

Knowing this, we can easily sort our questions for each type of quiz
*/

http.createServer(basicServer).listen(port, () => {
    console.log(`Server started on port ${port}`);
  });