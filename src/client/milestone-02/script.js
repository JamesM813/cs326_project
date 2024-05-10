/**
 * Our quiz questions.
 * We may have to move them to a different file or a mock database
 * @type {Array<Object>} An array of objects representing quiz questions, possible answers, and the correct answer.
 */

let timerInterval;
let selectedQuizData;

function mockFetch(url) {
  //this is a mocking fetch operation from some API that we can eventually create!
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === 'history') {
        resolve(historyQuizData);
      } else if (url === 'science') {
        resolve(scienceQuizData);
      } else if (url === 'math') {
        resolve(mathQuizData);
      } else {
        reject(new Error('Invalid URL'));
      }
    }, Math.random() * 1000); // simulating network delay
  });
}



//eventually, this will be in a pouchDB database. For now, we will just keep it like this 
let historyQuizData = [
    {
      question: "What year did World War II end?",
      answers: ["1945", "1939", "1950", "1940"],
      correctAnswer: "1945"
    },
    {
      question: "What is the capital of France?",
      answers: ["London", "Rome", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
  ];

let scienceQuizData = [
    {
        question: "What is the chemical symbol for water?",
        answers: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O"
    },

    {
      question: "What is the closest planet to the sun?",
      answers: ["Venus", "Mars", "Earth", "Mercury"],
      correctAnswer: "Mercury"
    },
];

let mathQuizData = [
  {
      question: "What is the value of pi (π)?",
      answers: ["3.14", "2.71", "1.618", "4.669"],
      correctAnswer: "3.14"
  },
  {
      question: "What is the square root of 81?",
      answers: ["7", "8", "9", "10"],
      correctAnswer: "9"
  }
];

//here we are assuming that we do NOT have our data yet, while we mock the process


  
//we will also add more types of question in the back-end

  let currentQuestion = 0;
  let score = 0;
  let timeLeft = 10; //maybe change this to update dynamically, like 5 seconds per question?

  async function startQuiz(category) { //this functions as expected, you can tell when you click a category it takes a sec to "load"
    try {
      selectedQuizData = await mockFetch(category.toLowerCase());
      const quizSection = document.getElementById("quiz");
      quizSection.style.display = "none";
      loadQuestion(selectedQuizData);
      startTimer();
    } catch (error) {
      console.error(error);
    }
  }
  
  //generates elements for displaying a quiz question
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

  //compares user answer to solution and updates score accordingly, loads next question if applicable
  function checkAnswer(answer, selectedQuizData) {
    const currentQuizData = selectedQuizData[currentQuestion];
        if (answer === currentQuizData.correctAnswer) {
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
  
  //manages countdown timer 
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
  
  //concludes quiz and changes the display screen
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

function showCorrectAnswers() {
  const resultSection = document.getElementById("result");
  const correctAnswersSection = document.getElementById("correct-answers");


  if (correctAnswersSection.style.display === "block") {
      correctAnswersSection.style.display = "none";

      resultSection.querySelector("button").style.display = "block";
  } else {
      correctAnswersSection.innerHTML = "";
 
      const correctAnswersList = document.createElement("ul");
      correctAnswersList.classList.add("correct-answers-list");

      selectedQuizData.forEach((question, index) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `<strong>Question ${index + 1}:</strong> ${question.correctAnswer}`;
          correctAnswersList.appendChild(listItem);
      });
 
      correctAnswersSection.appendChild(correctAnswersList);

      correctAnswersSection.style.display = "block";

      resultSection.querySelector("button").style.display = "none";
  }
}

function quitQuiz() {
  localStorage.setItem('playerScore', '0'); //reset player score
  window.location.reload();
}

//should store quiz score to local storage
function initializeQuizScore(){
  let playerScore = localStorage.getItem('playerScore');
  if(playerScore === null){
    localStorage.setItem('playerScore', 0);
    playerScore = '0';
  }
  return parseInt(playerScore);
}

function updateQuizScore(scoreToAdd){
  let playerScore = initializeQuizScore();
  playerScore+=scoreToAdd;
  localStorage.setItem('playerScore', playerScore.toString());
  const scoreElement = document.getElementById('player-score');
  scoreElement.textContent = 'Game Score:' + playerScore;
}

let playerScore = initializeQuizScore();

function updateTotalScore(){
  let totalScore = 0;
  selectedQuizData.forEach(question => {
      if (checkAnswer(question.answer, question.correctAnswer)) {
        totalScore++; // Increment total score for each correct answer
      }
    });
  updateQuizScore(totalScore);
}

document.addEventListener('DOMContentLoaded', () => {
  updateQuizScore(playerScore); 
});

  