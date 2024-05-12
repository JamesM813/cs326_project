let timerInterval;
let currentQuestion = 0;
let score = 0;
let timeLeft = 10;

  /**
   * Starts quiz according to the category unless an error is caught.
   * @param {string} category Category of the quiz ("history", "science", "math").
   */
  async function startQuiz(category) { 
    try {
      const url = `/quizQuestions?category=${category}`
      const response = await fetch(url)
  
      if (!response.ok) {
        throw new Error('Failed to load quiz data');
      }
      const quizData = await response.json()
      console.log(`Quiz data loaded for category '${category}':`, quizData)
      loadQuestion(quizData)
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  }
  
  
  
  function loadQuestion(selectedQuizData) {
    const questionElement = document.getElementById("question-text");
    const answerElement = document.getElementById("answers");
    const questionNumberElement = document.getElementById("question-number");
  
    const currentQuizData = selectedQuizData[currentQuestion];
  
    questionElement.innerText = currentQuizData.question;
    questionNumberElement.innerText = currentQuestion + 1;
  
    answerElement.innerHTML = "";
  
    currentQuizData.answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer;
      button.classList.add("btn");
      button.addEventListener("click", () => checkAnswer(answer, selectedQuizData));
      answerElement.appendChild(button);
    });
  }

  function checkAnswer(answer, selectedQuizData) {
    const currentQuizData = selectedQuizData[currentQuestion];
        if (answer === currentQuizData.answer) {
            score++;
            updateQuizScore(1);
        }
        currentQuestion++;
        if (currentQuestion < selectedQuizData.length) {
            loadQuestion(selectedQuizData);
        } else {
            clearInterval(timerInterval);
            endQuiz(selectedQuizData);
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
        checkAnswer("", selectedQuizData);
      }
    }, 1000); 
  }
  
  function endQuiz(selectedQuizData) {
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
    loadQuestion(selectedQuizData);
  
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
  totalScore+=scoreToAdd;
  localStorage.setItem('totalScore', totalScore.toString());
  const totalScoreElement = document.getElementById('total-score');
  totalScoreElement.textContent = 'Total Score:' + totalScore;
}



  