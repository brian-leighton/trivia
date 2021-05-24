//Element Variable List
const quizType = document.getElementById("quiz_type"),
      quizSubmit = document.getElementById('quiz_submit'),
      generatedQuiz = document.getElementById('generated_quiz'),
      questionTotal = document.getElementById('question_total'),
      quizName = document.getElementById('quiz_name'),
      customQuiz = document.getElementById('custom_quiz'),
      customQuestionType = document.getElementById('custom_question_type'),
      customQuestionWritten = document.getElementById('custom_question_written'),
      customQuestionMultipleContainer = document.getElementById('custom_question_multiple-container'),
      quizDifficulty = document.getElementById('quiz_difficulty'),
      showQuizList = document.getElementById('quiz_list');

// determine if user wants to input their own quiz, or if they want to generate one.
let isCustom = quizType.checked;
console.log(quizType.checked);
let quizList = [];

window.onload = async (e) => {
    // get list of trivia quizes
    let response = await axios.get("/get/trivia");
    quizList = response.data;
    // Add options for the select input to determine the desired length of quiz
    renderOptionList(45);
}

function renderOptionList(max){
    //loop through until max is reached creating a list of options to append to the select element
    for(let i = 1; i <= max; i++){
        let element = document.createElement('option');
        element.value = i;
        element.innerText = i;
        // add class/id
        questionTotal.appendChild(element);
    }
}

quizType.addEventListener('click', (e) => {
    customQuiz.classList.toggle("hidden");
    generatedQuiz.classList.toggle("hidden");
});

customQuestionType.addEventListener('change', (e) => {
    if(e.target.value !== "text"){
        customQuestionMultipleContainer.classList.toggle("hidden");
        console.log(e.target.value, "a value");
        return;
    }
    customQuestionMultipleContainer.classList.toggle("hidden");
    console.log(e.target.value, "another value");
});

quizSubmit.addEventListener('click', async (e) => {
    let triviaObj = {
        title: quizName.value || "anon",
        difficulty: quizDifficulty.value,
        quiz: [],
    };
    if(!isCustom){
        let request;
        if(quizDifficulty.value === "mixed"){
            request = await axios.get(`https://opentdb.com/api.php?amount=${questionTotal.value}`);
            console.log('mixed: ', request.data);
            triviaObj.quiz = request.data.results;
        } else {
            request = await axios.get(`https://opentdb.com/api.php?amount=${questionTotal.value}&difficulty=${quizDifficulty.value}`);
            triviaObj.quiz = request.data.results;
            // console.log('set difficulty: ', request.data, quizDifficulty);
        }
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
    }
});


