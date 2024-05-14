let timerInterval;
let currentQuestion = 0;
let score = 0;
let timeLeft = 10
let quizData;

  /**
   * Starts quiz according to the category unless an error is caught.
   * @param {string} category Category of the quiz ("history", "science", "math").
   */
  async function startQuiz(category) { 
    try {
      const url = `http://localhost:3000/quizQuestions?category=${category}`
      const response = await fetch(url)
  
      if (!response.ok) {
        throw new Error('Failed to load quiz data');
      }
      quizData = await response.json()
      console.log(`Quiz data loaded for category '${category}':`, quizData)
      loadQuestion(quizData)
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  }
  
  
  
  function loadQuestion(quizData) {
    const questionElement = document.getElementById("question-text");
    const answerElement = document.getElementById("answers");
    const questionNumberElement = document.getElementById("question-number");
  
    const currentQuizData = quizData[currentQuestion];
  
    questionElement.innerText = currentQuizData.question;
    questionNumberElement.innerText = currentQuestion + 1;
  
    answerElement.innerHTML = "";
  
    currentQuizData.answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer;
      button.classList.add("btn");
      button.addEventListener("click", () => checkAnswer(answer, quizData));
      answerElement.appendChild(button);
    });
  }

  async function checkAnswer(answer, selectedQuizData) {
    const currentQuizData = selectedQuizData[currentQuestion];
        if (answer === currentQuizData.answer) {
            score++;
            updateQuizScore(1);
              
            try {
              const response = await fetch('http://localhost:3000/updatePlayerScore', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ score }),
                });
            
                if (!response.ok) {
                  throw new Error('Failed to update player score');
                }
            
                console.log('Player score updated successfully')
              } catch (error) {
                console.error('Error updating player score:', error);
                throw error;
              }
            
        }
        currentQuestion++;
        if (currentQuestion < selectedQuizData.length) {
            loadQuestion(quizData);
        } else {
            clearInterval(timerInterval);
            endQuiz(quizData);
        }
      }
    
  
  function startTimer() {
    const timerElement = document.getElementById("time-left");
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        timerElement.innerText = timeLeft;
      } else {
        clearInterval(timerInterval);
        checkAnswer("", quizData);
      }
    }, 1000); 
  }
  
  async function endQuiz(selectedQuizData) {
    const quizSection = document.getElementById("quiz");
    const resultSection = document.getElementById("result");
    const resultTextElement = document.getElementById("result-text");
    const showAnswersButton = document.getElementById("show-answers-button");
    quizSection.style.display = "none";
    resultSection.style.display = "block";
    showAnswersButton.style.display = "block";

    clearInterval(timerInterval); //restarts timer
  
    resultTextElement.innerText = `You scored ${score} out of ${selectedQuizData.length}!`;
    updateTotalScore(score);

    try {
      const url = 'http://localhost:3000/savePlayerScore';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }), // Pass the score in the body
      });
  
      if (!response.ok) {
        throw new Error('Failed to save score data');
      }

      if (response.status === 204) {
        console.log('Player score saved successfully');
        return; // No need to parse response
      }
  
      // Log success message
      console.log('Player score saved successfully');
    } catch (error) {
      console.error('Error saving quiz score:', error);
      throw error;
    }
  }
  

  /**
   * Restarts the quiz
   */
  function restartQuiz() {
    //resets quiz variables, question, and timer
    currentQuestion = 0;
    score = 0;
    timeLeft = 11;
    startTimer();
    loadQuestion(quizData);
  
    const quizSection = document.getElementById("quiz");
    const resultSection = document.getElementById("result");
    const showAnswersButton = document.getElementById("show-answers-button");
  
    quizSection.style.display = "none";
    resultSection.style.display = "none";
    showAnswersButton.style.display = "none"; 
  }

/**
 * Reveals correct answers for each question.
 */
function showanswers() {
  const resultSection = document.getElementById("result");
  const answersSection = document.getElementById("correct-answers");


  if (answersSection.style.display === "block") {
      answersSection.style.display = "none";

      resultSection.querySelector("button").style.display = "block";
  } else {
      answersSection.innerHTML = "";
 
      const answersList = document.createElement("ul");
      answersList.classList.add("correct-answers-list");

      selectedQuizData.forEach((question, index) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `<strong>Question ${index + 1}:</strong> ${question.answer}`;
          answersList.appendChild(listItem);
      });
 
      answersSection.appendChild(answersList);

      answersSection.style.display = "block";

      resultSection.querySelector("button").style.display = "none";
  }
}

/**
 * Exits the quiz and resets player score to 0.
 */
function quitQuiz() {
  localStorage.setItem('playerScore', '0'); //reset player score
  window.location.reload();
}

/**
 * Initializes quiz score by checking local storage
 * and if it isn't there then set to 0.
 * @returns {number} Initialized quiz score.
 */
function initializeQuizScore(){
  let playerScore = localStorage.getItem('playerScore');
  if(playerScore === null){
    localStorage.setItem('playerScore', 0);
    playerScore = '0';
  }
  return parseInt(playerScore);
}

/**
 * Updates player's quiz score to the given score and updated
 * to local storage accordingly.
 * @param {number} scoreToAdd The score to add to player's current score. 
 */
function updateQuizScore(scoreToAdd){
  let playerScore = initializeQuizScore();
  playerScore+=scoreToAdd;
  localStorage.setItem('playerScore', playerScore.toString());
  const scoreElement = document.getElementById('player-score');
  scoreElement.textContent = 'Game Score:' + playerScore;
}

let playerScore = initializeQuizScore();

//should store total score to local storage
function initializeTotalScore(){
  let totalScore = localStorage.getItem('totalScore');
  if(totalScore === null){
    localStorage.setItem('totalScore', 0);
    totalScore = '0';
  }
  return parseInt(totalScore);
}

function updateTotalScore(scoreToAdd){
  let totalScore = initializeTotalScore();
  totalScore +=scoreToAdd;
  localStorage.setItem('totalScore', totalScore.toString());
}
  