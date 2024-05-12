import * as http from "http";
import * as url from "url";
import Database from "./db.js";

async function basicServer(request, response) {

  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Grab the HTTP method.
  const method = request.method;

  // Create a new database instance.
  const database = await Database("trivia_db");

  if (method === "POST" && pathname === "/savePlayerScore") {
    console.log("POST /savePlayerScore");

    try {
      const { score } = query;
      await database.savePlayerScore(parseInt(score));
      response.writeHead(200);
      response.end();
    } catch (error) {
      console.log("Failed to save player score:", error);
      response.writeHead(501);
      response.end();
    }
  } else if (method === "GET" && pathname === "/highestScores") {
    console.log("GET /highestScores");

    try {
      const data = await database.top10Scores();
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(data.data));
      response.end();
    } catch (error) {
      console.log("Failed to retrieve highest scores:", error);
      response.writeHead(501);
      response.end();
    }
  } else {
    const sendIt = async (pathname, type) => {
        // The client files are found in the client directory, so we must prepend
        // the client path to the file requested. We also recognize the meaning of
        // a '/' to refer to the index.html file.
        const file = pathname === "/" ? "index.html" : pathname;
        try {
          const data = await readFile(
            path.join(
              path.dirname(url.fileURLToPath(import.meta.url)),
              "..",
              "client",
              file,
            ),
            "utf8",
          );
          response.writeHead(200, { "Content-Type": type });
          response.write(data);
        } catch (err) {
          response.statusCode = 404;
          response.write("Not found");
        }
        response.end();
      };
  
      // Determine the content type of the requested file (if it is a file).
      if (pathname.endsWith(".css")) {
        sendIt(pathname, "text/css");
      } else if (pathname.endsWith(".js")) {
        sendIt(pathname, "text/javascript");
      } else if (pathname.endsWith(".json")) {
        sendIt(pathname, "application/json");
      } else if (pathname.endsWith(".html")) {
        sendIt(pathname, "text/html");
      } else if (pathname.endsWith("/")) {
        sendIt(pathname, "text/html");
      } else {
        sendIt(pathname, "text/plain");
      }
    }
}

// Start the server on port 3260.
http.createServer(basicServer).listen(3260, () => {
  console.log("Server started on port 3260");
});
