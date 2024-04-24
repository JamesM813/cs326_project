//Our quiz questions. We may have to move this to a different file
//or a mock database thing
let timerInterval;
let selectedQuizData;

//eventually, this will be in a pouchDB database. For now, we will just keep it like this 
const historyQuizData = [
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

  const scienceQuizData = [
    {
        question: "What is the chemical symbol for water?",
        answers: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O"
    },
];

const mathQuizData = [
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
  
//we will also add more types of question in the back-end

  let currentQuestion = 0;
  let score = 0;
  let timeLeft = 10; //maybe change this to update dynamically, like 5 seconds per question?

  function startQuiz(category) {

    switch (category.toLowerCase()) {
        case 'history':
            selectedQuizData = historyQuizData;
            break;
        case 'science':
            selectedQuizData = scienceQuizData;
            break;
        case 'math':
            selectedQuizData = mathQuizData;
            break;
        default:
            console.error('Invalid category');
            return;
    }

    const quizSection = document.getElementById("quiz");
    quizSection.style.display = "none";
    loadQuestion(selectedQuizData);
    startTimer();
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

        if (answer === currentQuizData.correctAnswer) {
            score++;
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

    clearInterval(timerInterval);
  
    resultTextElement.innerText = `You scored ${score} out of ${selectedQuizData.length}!`;
  }
  
  function restartQuiz() {
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
    window.location.reload();
}
  