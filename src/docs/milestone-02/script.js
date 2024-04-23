//Our quiz questions. We may have to move this to a different file
//or a mock database thing

const quizData = [
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
  
  let currentQuestion = 0;
  let score = 0;
  let timeLeft = 10;

  function startQuiz(category) {
    loadQuestion();
  }
  
  function loadQuestion() {
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
      button.addEventListener("click", () => checkAnswer(answer));
      answerElement.appendChild(button);
    });
  
    startTimer();
  }
  
  function checkAnswer(answer) {
    const currentQuizData = quizData[currentQuestion];
  
    if (answer === currentQuizData.correctAnswer) {
      score++;
    }
  
    currentQuestion++;
  
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      endQuiz();
    }
  }
  
  function startTimer() {
    const timerElement = document.getElementById("time-left");
    const timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        timerElement.innerText = timeLeft;
      } else {
        clearInterval(timerInterval);
        checkAnswer("");
      }
    }, 1000);
  }
  
  function endQuiz() {
    const quizSection = document.getElementById("quiz");
    const resultSection = document.getElementById("result");
    const resultTextElement = document.getElementById("result-text");
  
    quizSection.style.display = "none";
    resultSection.style.display = "block";
  
    resultTextElement.innerText = `You scored ${score} out of ${quizData.length}!`;
  }
  
  function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    timeLeft = 10;
    loadQuestion();
  
    const quizSection = document.getElementById("quiz");
    const resultSection = document.getElementById("result");
  
    quizSection.style.display = "block";
    resultSection.style.display = "none";
  }
  