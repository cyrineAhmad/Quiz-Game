let quizData = {
    easy: [],
    medium: [],
    hard: [],
    }

const url = "questions.json";
    
async function loadQuestions() {
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Network response was not fullfild: ${response.statusText}`)
    }

        quizData = await response.json();
        console.log("Questions was loaded, quizData")

    }catch(error) {
        console.error("Error loading the questions: ", error)
    }

}

loadQuestions();
let currentQuestionIndex = 0;
let currentLevel = "easy";
let score = 0;
let timer;
let timeLeft = 50;
let quizEnded = false;


function startQuiz(level){
    if(!quizData[level]) {
        alert(`No data for this level ${level}`);
        console.error(`No data for this level ${level}'`)
    return;
    }
    currentLevel = level;
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 50;
    quizEnded = false;
    document.getElementById("result").innerText = "";
    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("difficulty-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("next-button").style.display = "inline-block";
    document.getElementById("question-count").style.display = "block";
    loadQuestion();
    startTimer();
}


function loadQuestion(){
    if(quizEnded) {
        return;
    }

    const questionData = quizData [currentLevel] [currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;

    const optionsContainer= document.getElementById("options");
    optionsContainer.innerHTML = "";


    questionData.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("option-button");
    button.innerText = option;
    button.onclick = () => checkAnswer (option, button)
    optionsContainer.appendChild(button)
});

document.getElementById("next-button").disabled = true;
const remainingQuestions =quizData[currentLevel].length - currentQuestionIndex - 1;
document.getElementById("question-count").innerText =`Remaining Questions: ${remainingQuestions}`;
}
function checkAnswer (selectedOption, button) {
    if(quizEnded) return;

    const correctAnswer = quizData[currentLevel] [currentQuestionIndex].answer;
    const optionButtons = document.querySelectorAll(".option-button");

    optionButtons.forEach((btn) => (btn.disabled = true));

    if (selectedOption === correctAnswer) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("incorrect");
        document.querySelector(`.option-button:not(.incorrect):not(.selected)`).classList.add("correct");
    }
    
document.getElementById("next-button").disabled = false;
}

function nextQuestion(){
         if(quizEnded) return;
         currentQuestionIndex++;

         if(currentQuestionIndex < quizData[currentLevel].length) {
            loadQuestion();
         }
         else{
            clearInterval(timer);
            showResult();
         }
}

function showResult(){
    quizEnded = true;
    let resultMessage =  `Quiz Over! You scored ${score} out of ${quizData[currentLevel].length}`;
    if (score >= quizData[currentLevel].length + 0.7) {
        resultMessage = `Congrats You won, You scored ${score} out of ${quizData[currentLevel].length}`
    }
    else{
        resultMessage = `Sorry You lost, You scored ${score} out of ${quizData[currentLevel].length}`
    }

    document.getElementById("result").innerText = resultMessage;
    document.getElementById("leaderboard").innerText = `Leaderboard: \n Score: ${score}`;
    document.getElementById("leaderboard").style.display = "block";
    document.getElementById("next-button").style.display = "none";
    document.getElementById("question-count").style.display = "none";
}

function startTimer() {
 timer = setInterval(() => {
    if(quizEnded) {
        clearInterval(timer);
        return;
    }
    timeLeft--;
    document.getElementById("timer-value").innerText = timeLeft;
    if(timeLeft <=0) {
        clearInterval(timer);
        quizEnded = true;
        showResult();
    }
  },1000)
}

document.getElementById("next-button").addEventListener("click", nextQuestion)
