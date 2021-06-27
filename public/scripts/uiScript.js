//QUESTION HISTORY SLIDE BAR
const qHistory = document.querySelector('.quiz__history');
const qContent = document.querySelector('.quiz__content');
document.querySelector('.quiz__history--btn').addEventListener('click', () => {
    qContent.classList.toggle("quiz__content--hide");
    qHistory.classList.toggle('quiz__history--expand');
});
let qAnswers = document.querySelectorAll(".quiz__answer--multiple");
for(let i = 0; i < qAnswers.length; i++){
    qAnswers[i].addEventListener('click', (e) => selectAnswer(e));
}

function selectAnswer(event){
    const selectedAnswers = document.querySelectorAll(".quiz__answer--selected");
    //clear all instances of selected class;
    selectedAnswers.forEach(answer => {
        answer.classList.remove("quiz__answer--selected");
    })
    //apply selected class to event target
    event.target.classList.add("quiz__answer--selected");
}