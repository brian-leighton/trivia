//QUESTION HISTORY SLIDE BAR
const qHistory = document.querySelector('.quiz__history');
document.querySelector('.quiz__history--btn').addEventListener('click', () => {
    qHistory.classList.toggle('quiz__history--expand');
});
