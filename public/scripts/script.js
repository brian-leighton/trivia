
//QUIZ CREATION
const quizType = document.getElementById("quiz_type"),
      quizSubmit = document.getElementById('quiz_submit'),
      generatedQuiz = document.getElementById('generated_quiz'),
      userQuiz = document.getElementById('user_quiz');
// determine if user wants to input their own quiz, or if they want to generate one.
let customQuiz = false;

quizType.addEventListener('change', (e) => {
    customQuiz = quizType.checked;
    if(customQuiz){
        console.log('we togglin..');
        userQuiz.classList.toggle("hidden");
    }
});

quizSubmit.addEventListener('click', async (e) => {
    console.log('click event');
    let data = {
        user: "wow",
        quiz: [1,2,123,4,5],
        custom: customQuiz
    }
    await axios.request({
        method: "post",
        url: "/new/quiz",
        data
    }).then((res) => {
        console.log(res.data);
        // console.log(JSON.parse(res.));
    });
    // console.log(response.config.data);
    // axios.post("/new/quiz", data).then((response) => console.log(response.config.data));
});


