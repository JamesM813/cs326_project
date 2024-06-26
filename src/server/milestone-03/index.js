import express from 'express';
import cors from 'cors';
import Database from './db.js';

const app = express();
const port = 3000;

app.use(cors());
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

app.get('/quizQuestions/', async (req, res) => {
  console.log(`GET /quizQuestions?category=${req.body}`);
  try {
    const { category } = req.query
    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    const questions = await database.getQuizQuestions(category);
    res.status(200).json(questions);
  } catch (error) {
    console.error('Failed to retrieve quiz questions:', error);
    res.status(500).json({ error: 'Failed to retrieve quiz questions' });
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


app.route("*").all(async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
