//Element Variable List
const quizType = document.getElementById("quiz_type"),
      quizSubmit = document.getElementById('quiz_submit'),
      generatedQuiz = document.getElementById('generated_quiz'),
      questionTotal = document.getElementById('question_total'),
      quizName = document.getElementById('quiz_name'),
      customQuiz = document.getElementById('custom_quiz'),
      customQuestion = document.getElementById('custom_question'),
      customQuestionType = document.getElementById('custom_question_type'),
      customQuestionWritten = document.getElementById('custom_question_written'),
      customQuestionMultipleContainer = document.getElementById('custom_question_multiple-container'),
      customQuestionMultipleTotal = document.getElementById('custom_question_multiple_total'),
      nextQuestion = document.getElementById('next_question'),
      quizDifficulty = document.getElementById('quiz_difficulty'),
      showQuizList = document.getElementById('quiz_list');

let quizList = [];

window.onload = async (e) => {
    // get list of trivia quizes
    let response = await axios.get("/get/trivia");
    //reset the radio input on load to prevent displaying inaccurate form
    quizType.checked = false;
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


// CUSTOM trivia quiz event handlers
customQuestionType.addEventListener('change', (e) => {
    customQuestionMultipleContainer.classList.toggle("hidden");
    customQuestionWritten.classList.toggle('hidden');
    return;
});

customQuestionMultipleTotal.addEventListener('change', (e) => {
    const customQuestionMultipleAnswers = document.getElementById('custom_question_multiple_answers');
    //removes extra inputs when the number changes *currently clears input value
    const multipleChoiceAnswer = document.querySelectorAll(".multipleChoice__answer")
                                .forEach((el) => el.remove());
                                
    for(let i = 0; i < e.target.value; i++){
        //create answer input for the total number of options
        customQuestionMultipleAnswers.appendChild(renderAnswerInput(i));

    }   
});

//renders the multiple choice answer input component
function renderAnswerInput(index) {
    const div = document.createElement('div');
    const inputText = document.createElement('input');
    const label = document.createElement('label');
    const inputRadio = document.createElement('input');

    div.classList.add("multipleChoice__answer");
    div.appendChild(inputText);
    label.htmlFor = `checkbox-${index}`;
    inputRadio.id = `checkbox-${index}`;
    inputRadio.type = "checkbox";
    label.innerText = "Is this the correct answer?";
    div.appendChild(label);
    div.appendChild(inputRadio);
    return div;
}


//Quiz creation form handlers/functions
nextQuestion.addEventListener('click', () => CreateNextQuestion())
function CreateNextQuestion(){
    // let result = {
    //     question: customQuestionMultiple.value
    // }
    // if(customQuestionMultiple.value){
    //     console.log(customQuestionMultiple.value);
    // } else {
    // }
    console.log('no custom value', customQuestion.value);
}

    // quiz object = {
    //     title: String,
    //     author: String,
    //     quiz: [
    //         {
    //             question: String,
    //             difficulty: String,
    //             multplieChoice: Boolean,
    //             answer: String,
    //             incorrectAnswers: Array
    //         }
    //     ]
    // }
// check if user wants to make a custom trivia quiz
let isCustom = true;
// let isCustom = quizType.checked;
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


