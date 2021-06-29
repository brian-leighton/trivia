
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
// reference to question index in array
let currentQuestion = 0;
//render question(quiz.quiz[currentQuestion])
const multiAnswer = document.querySelector('#multiple'),
      writtenAnswer = document.querySelector('#written'),
      qQuestion = document.querySelector("#question");

function renderQuestion(question){
    console.log(question);
    //display question
    qQuestion.innerHTML = question.question;
    //apply classes to hide and show the respective inputs
    // check the type of question (multiple/written)
    if(question.type === "text"){
        multiAnswer.classList.add('quiz__content--hide');
        writtenAnswer.classList.remove('quiz__content--hide');
    } else {
        writtenAnswer.classList.add('quiz__content--hide');
        multiAnswer.classList.remove('quiz__content--hide');
        // render multiple choice answers
        multiAnswer.appendChild(renderAnswers(question.answers));
    }
    
}
//render multi choice answers
function renderAnswers(answers){
    const result = [];

    //add new answers
    answers.forEach((answer) => {
        //this code causes an error but doesn't break the application
        const div = document.createElement('div'),
        p   = document.createElement('p');
        div.classList.add('quiz__answer--multiple');
        p.innerHTML = answer.answer;
        console.log(answer.answer);
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
    })
    //apply selected class to event target
    event.target.classList.add("quiz__answer--selected");
}
//select next question
function nextQuestion(){
    //reset if at the end of the quiz
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
//toggle between multiple choice and written answer based on the question type
//update question history when new question is added
//handle written input answers