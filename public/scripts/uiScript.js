
//QUESTION HISTORY SLIDE BAR
const qHistory = document.querySelector('.quiz__history');
const qContent = document.querySelector('.quiz__content');
document.querySelector('.quiz__history--btn').addEventListener('click', () => {
    qContent.classList.toggle("quiz__content--hide");
    qHistory.classList.toggle('quiz__history--expand');
});
// let qAnswers = document.querySelectorAll(".quiz__answer--multiple");
// for(let i = 0; i < qAnswers.length; i++){
//     qAnswers[i].addEventListener('click', (e) => selectAnswer(e));
// }

const quizSubmit = document.querySelector(".quiz__answer--submit");
//clickable button is the ID
document.querySelector("#quiz__answer--submit").addEventListener('click', (e) => {
    quizSubmit.classList.toggle("quiz__answer--submit-check");
});

document.querySelector(".quiz__result--btn").addEventListener('click', (e) => {
    // e.stopImmediatePropagation();
    e.stopPropagation();
    document.querySelector('.modal').classList.toggle("quiz__content--hide");
});

const modal = document.querySelector(".modal");
modal.addEventListener('click', (e) => {
    // check if the parent is clicked to catch only modal event
    if(modal === e.target){
        console.log('parent click');
        modal.classList.toggle("quiz__content--hide");
    }
});