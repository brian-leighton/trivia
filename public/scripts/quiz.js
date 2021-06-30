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
    // check the type of question (multiple/written)
    if(question.type === "text"){
        //apply classes to hide and show the respective inputs
        multiAnswer.classList.add('quiz__content--hide');
        writtenAnswer.classList.remove('quiz__content--hide');
    } else {
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
        // userAnswer ? console.log(userAnswer.index) : console.log('no') ;
        const div = document.createElement('div'),
        p = document.createElement('p');
        userAnswer && userAnswer.index === index ? 
                    div.classList.add('quiz__answer--multiple', 'quiz__answer--selected') :
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
    if(userAnswer.isCorrect){
        correctTotal++;
    }
    quizHistory[currentQuestion].userAnswer = userAnswer;
    event.target.classList.add("quiz__answer--selected");
    nextQuestion();
}
function isComplete(){
    if(quizHistory.length === quiz.quiz.length){
        if(confirm('Congratulations! Are you ready to Submit your answers?')){
            //render result
            renderResult();
            return true;
        }
    }
}
function renderResult(){
    const container = document.querySelector(".quiz__result--total");
    console.log(quizHistory.length);
    announceScore(correctTotal, quizHistory.length);
        //   document.querySelector(".quizTotal").
    document.querySelector(".quiz__result").classList.toggle('quiz__content--hide');
}
let pauseQuiz = false;
//select next question
function nextQuestion(){
    //reset if at the end of the quiz
    // console.log(isComplete());
    if(isComplete()) return;
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
    //get hidden index number from element
    let li = question.target.closest('li');
    let node = Array.from(document.querySelector("#history").children);
    let index = node.indexOf(li);
    currentQuestion = index;
    renderQuestion(quizHistory[index]);
}
//handle written input answers
//tally final score