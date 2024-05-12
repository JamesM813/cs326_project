import express from 'express';
import Database from './db.js';

const app = express();
const port = 3260;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a new database instance
const database = await Database("trivia_db");

// Route to handle saving a player's score
app.post('/savePlayerScore', async (req, res) => {
  console.log("POST /savePlayerScore");

  try {
    const { score } = req.body;
    await database.savePlayerScore(parseInt(score));
    res.sendStatus(200);
  } catch (error) {
    console.error("Failed to save player score:", error);
    res.sendStatus(500);
  }
});

app.get('/highestScores', async (req, res) => {
  console.log("GET /highestScores");

  try {
    const data = await database.top10Scores();
    res.status(200).json(data.data);
  } catch (error) {
    console.error("Failed to retrieve highest scores:", error);
    res.sendStatus(500);
  }
});

app.put('/updatePlayerScore', async (req, res) => {
  
    try {
      const { newScore } = req.body;
      const result = await database.updatePlayerScore(parseInt(newScore));
      res.status(200).json(result.data);
    } catch (error) {
      console.error("Failed to update player score:", error);
      res.status(500).json({ error: "Failed to update player score" });
    }
  });
  
  app.delete('/deletePlayerScore', async (req, res) => {
    try {
      const result = await database.deletePlayerScore();
      res.status(200).json(result.data);
    } catch (error) {
      console.error("Failed to delete player scores:", error);
      res.status(500).json({ error: "Failed to delete player scores" });
    }
  });

app.use(express.static('client'));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
