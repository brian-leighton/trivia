//QUIZ CREATION
const quizType = document.getElementById("quiz_type"),
      quizSubmit = document.getElementById('quiz_submit'),
      generatedQuiz = document.getElementById('generated_quiz'),
      questionTotal = document.getElementById('question_total'),
      quizName = document.getElementById('quiz_name'),
      userQuiz = document.getElementById('user_quiz'),
      showQuizList = document.getElementById('quiz_list');
// determine if user wants to input their own quiz, or if they want to generate one.
let customQuiz = false;
let quizList = [];
window.onload = async (e) => {
    let response = await axios.get("/get/trivia");
    quizList = response.data;
    console.log(response.data);
}

quizType.addEventListener('change', (e) => {
    customQuiz = quizType.checked;
    if(customQuiz){
        console.log('we togglin..');
        userQuiz.classList.toggle("hidden");
    }
});

quizSubmit.addEventListener('click', async (e) => {
    let triviaObj = {
        title: quizName.value || "anon",
        quiz: [],
    };
    if(!customQuiz){
        console.log('value: ', questionTotal.value);
        let request = await axios.get(`https://opentdb.com/api.php?amount=${questionTotal.value}`);
        triviaObj.quiz = request.data.results;
    }
    try{
        //save generated quiz to database
        await axios.request({
            method: "post",
            url: "/new/quiz",
            data: triviaObj,
        }).then((res) => {
            quizList.push({id: res.data, title: triviaObj.title, length: triviaObj.quiz.length});
        });
    } catch(err){
        console.log(err);
    }
});


