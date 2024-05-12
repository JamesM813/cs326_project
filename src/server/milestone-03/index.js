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
      await database.savePlayerScore(score);
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
      response.write(JSON.stringify(data));
      response.end();
    } catch (error) {
      console.log("Failed to retrieve highest scores:", error);
      response.writeHead(501);
      response.end();
    }
  } else {

    const { pathname } = parsedUrl;
    const filePath = pathname === "/" ? "/index.html" : pathname;

    try {
      // Read the file from the 'client' directory
      const fileData = await readFile(path.join(__dirname, "client", filePath), "utf8");

      // Determine the content type based on the file extension
      let contentType = "text/html";
      if (filePath.endsWith(".css")) contentType = "text/css";
      else if (filePath.endsWith(".js")) contentType = "application/javascript";
      else if (filePath.endsWith(".json")) contentType = "application/json";

      // Send the file data with appropriate content type
      response.writeHead(200, { "Content-Type": contentType });
      response.write(fileData);
      response.end();
    } catch (error) {
      console.error("Failed to serve static file:", error);
      response.writeHead(404);
      response.end();
    }
  }
}

// Start the server on port 3260.
http.createServer(basicServer).listen(3260, () => {
  console.log("Server started on port 3260");
});
