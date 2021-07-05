import announceScore from './trivia.js';

window.onload = async () => {
    let url = window.location.pathname;
    let triviaId = url.substring(url.lastIndexOf('/') + 1);
    let triviaRes = await axios.get(`/get/trivia/${triviaId}`);
    quiz = triviaRes.data;
    //initial render of questions
    renderQuestion(quiz.quiz[currentQuestion]);
}
let quiz = [];
let quizHistory = [];
let correctTotal = 0;
let incorrectTotal = 0;
// reference to question index in array
let currentQuestion = 0;
//render question(quiz.quiz[currentQuestion])
const multiAnswer = document.querySelector('#multiple'),
      writtenAnswer = document.querySelector('#written'),
      qQuestion = document.querySelector("#question");

function renderQuestion(question){
    //display question
    qQuestion.innerHTML = question.question;
    //if quiz is complete render with correct answer highlighted
    // check the type of question (multiple/written)
    if(question.type === "text"){
        //if quiz is finished display written answers
        if(stopQuiz){
            renderWrittenAnswers(question);
        }
        //apply classes to hide and show the respective inputs
        multiAnswer.classList.add('quiz__content--hide');
        writtenAnswer.classList.remove('quiz__content--hide');
    } else {
        if(stopQuiz){
            document.querySelector('.quiz__answer--display-written').classList.add('quiz__content--hide');
        }
        writtenAnswer.classList.add('quiz__content--hide');
        multiAnswer.classList.remove('quiz__content--hide');
        // render multiple choice answers
        renderAnswers(question.answers, question.userAnswer);
    }
    //update history
    updateHistory(question, currentQuestion);
}
//render multi choice answers
function renderAnswers(answers, userAnswer){
    const result = [];
    clearAnswers(multiAnswer);
    //add new answers
    answers.forEach((answer, index) => {
        const div = document.createElement('div'),
        p = document.createElement('p');
        if(stopQuiz){
            if(answer.isCorrect){
                div.classList.add('isCorrect');
            } else if (userAnswer.index === index && !answer.isCorrect){
                div.classList.add('isIncorrect');
            }
        }
        userAnswer && userAnswer.index === index ? 
                    div.classList.add('quiz__answer--multiple', 'quiz__answer--selected', `${stopQuiz && !answer.isCorrect ? 'isIncorrect': null}`) :
                    div.classList.add('quiz__answer--multiple');
        p.innerHTML = answer.answer;
        div.appendChild(p);
        div.addEventListener('click', (e) => selectAnswer(e));
        multiAnswer.appendChild(div);
    });
}
//clear previous answers
function clearAnswers(node){
  node.innerHTML = '';
}
//select an answer
function selectAnswer(event){
    const selectedAnswers = document.querySelectorAll(".quiz__answer--selected");
    if(stopQuiz) { nextQuestion(); return};
    //clear all instances of selected class;
    selectedAnswers.forEach(answer => {
        answer.classList.remove("quiz__answer--selected");
    });
    //apply selected class to event target
    let div = event.target.closest('div');
    let node = Array.from(document.querySelector("#multiple").children);
    let index = node.indexOf(div);
    
    const userAnswer = quiz.quiz[currentQuestion].answers[index];
    //index is reference to answer styling later
    userAnswer.index = index;
    quizHistory[currentQuestion].userAnswer = userAnswer;
    event.target.classList.add("quiz__answer--selected");
    nextQuestion();
}
let stopQuiz = false;
function isComplete(){
    if(quizHistory.length === quiz.quiz.length){
        if(confirm('Congratulations! Are you ready to Submit your answers?')){
            //render result
            displayResult();
            stopQuiz = true;
        }
    }
}
function displayResult(){
    const container = document.querySelector(".quiz__result--total");
    calculateScore(quizHistory);
    announceScore(correctTotal, quizHistory.length);
        //   document.querySelector(".quizTotal").
    // document.querySelector(".quiz__result").classList.toggle('quiz__content--hide');
}
function calculateScore(userQuiz){
    let total = 0;
    userQuiz.forEach((question) => {
        // console.log(question.userAnswer);
        if(question.userAnswer.isCorrect){
            console.log(question.userAnswer.answer);
            total ++;
        }
    })
    console.log(total);
}
function renderResult(a){
    console.log(a);
}
//select next question
function nextQuestion(){
    //reset if at the end of the quiz
    if(!stopQuiz && isComplete()) return;
    if(currentQuestion >= quiz.quiz.length -1){
        currentQuestion = 0;
        renderQuestion(quiz.quiz[currentQuestion]);
        return;
    }
    currentQuestion = currentQuestion += 1;
    renderQuestion(quiz.quiz[currentQuestion]);
}
//select previous question
function previousQuestion(){
    if(currentQuestion <= 0){
        currentQuestion = quiz.quiz.length -1;
        renderQuestion(quiz.quiz[currentQuestion]);
        return;
    }
    currentQuestion = currentQuestion - 1;
    renderQuestion(quiz.quiz[currentQuestion]);
}
function updateHistory(question, index){
    for(let i = 0; i < quizHistory.length; i++){
        //if question already exsist in history don't add
        if(question.question === quizHistory[i].question){
            return;
        }
    }
    quizHistory.push(question);
    renderHistory();
}
function renderHistory(){
    //clear history
    document.querySelector("#history").innerHTML = '';
    quizHistory.forEach((question, index) => {
        let li = document.createElement('li');
        li.innerHTML = question.question;
        li.addEventListener('click', (e) => changeQuestion(e));
        document.querySelector("#history").appendChild(li);
    });
}
//handle selecting a specific question from history
function changeQuestion(question){
    let li = question.target.closest('li');
    let node = Array.from(document.querySelector("#history").children);
    let index = node.indexOf(li);
    currentQuestion = index;
    renderQuestion(quizHistory[index]);
}
const quizSubmit = document.querySelector(".quiz__answer--submit");
//clickable button is the ID
document.querySelector("#quiz__answer--submit").addEventListener('click', (e) => {
    quizSubmit.classList.toggle("quiz__answer--submit-check");
});
//handle written input answers
document.querySelector(".quiz__answer--submit").addEventListener('click', handleTextInput);
function handleTextInput(){
    const input = document.querySelector("#textInput");
    quizHistory[currentQuestion].userAnswer = checkAnswer(input.value, quiz.quiz[currentQuestion].answers);
    //allow for animation to happen;
    setTimeout(() => {nextQuestion(); quizSubmit.classList.remove('quiz__answer--submit-check');}, 1200);
    input.value = "";
    quizSubmit.classList.add('quiz__answer--submit-check');
}
//render written answers
function renderWrittenAnswers(question){
    document.querySelector('.quiz__answer--display-written').classList.remove('quiz__content--hide');
    const answerList = document.querySelector('.quiz__answer--list');
    
    document.querySelector('#userAnswer').innerText = question.userAnswer.answer;
    answerList.innerHTML = "";
    question.answers.forEach((answer) => {
        const li = document.createElement('li');
        li.classList.add('quiz__answer--list-item', 'col-5');
        li.innerText = answer;
        answerList.appendChild(li);
    });
}
//check written answer
function checkAnswer(userAnswer, answers){
    let answerObj = {answer: userAnswer, isCorrect: false}
    for(let i = 0; i < answers.length; i++){
        if(userAnswer === answers[i]){
            console.log(userAnswer.toLowerCase(), quiz.quiz[currentQuestion].answers[i].toLowerCase());
            answerObj.isCorrect = true;
        }
    }
    return answerObj;
}
//tally final score