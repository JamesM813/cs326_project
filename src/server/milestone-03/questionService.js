const axios = require('axios');

async function fetchTriviaQuestions() {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple');
        const { results } = response.data;
        return results;
    } catch (error) {
        console.error('Error fetching trivia questions:', error);
        throw error;
    }
}

module.exports = { fetchTriviaQuestions };