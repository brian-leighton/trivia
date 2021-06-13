//Element Variable List
const triviaCreate = document.getElementById('triviaCreate'),
      quizType = document.getElementById("quiz_type"),
      quizTypeLabel = document.getElementById('quiz_type_label'),
      quizSubmit = document.getElementById('quiz_submit'),
      generatedQuiz = document.getElementById('generated_quiz'),
      questionTotal = document.getElementById('question_total'),
      quizName = document.getElementById('quiz_name'),
      customQuiz = document.getElementById('custom_quiz'),
      customQuestionType = document.getElementById('custom_question_type'),
      customQuestionWritten = document.getElementById('custom_question_written'),
      customQuestionMultipleContainer = document.getElementById('custom_question_multiple-container'),
      customQuestionMultipleTotal = document.getElementById('custom_question_multiple_total'),
      nextQuestion = document.getElementById('next_question'),
      quizDifficulty = document.getElementById('quiz_difficulty'),
      showQuizList = document.getElementById('quiz_list');

let quizList = [];

window.onload = async (e) => {
    // reset form on load
    triviaCreate.reset();
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
    if(quizType.checked === false){
        quizTypeLabel.innerText = "Custom Questions?"
    } else {
        quizTypeLabel.innerText = "Generated Questions?"
    }
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
    const inputDiv = document.createElement('div');
    const inputText = document.createElement('input');
    const label = document.createElement('label');
    const inputRadio = document.createElement('input');

    div.classList.add("multipleChoice__answer");
    div.classList.add("input-group");
    inputText.classList.add('multipleChoice__option');
    inputText.classList.add('form-control');
    inputRadio.classList.add('isCorrect');
    inputRadio.id = `checkbox-${index}`;
    inputRadio.type = "radio";
    inputRadio.name = "isCorrect";
    inputDiv.classList.add('input-group-text');
    inputDiv.appendChild(inputRadio);
    div.appendChild(inputDiv);
    div.appendChild(inputText);
    return div;
}

//Quiz creation form handlers/functions
let newQuiz = [];
nextQuestion.addEventListener('click', () => createNextQuestion());

function createNextQuestion(){
    let customAnswerMultiple = document.querySelectorAll('.multipleChoice__option'),
    customAnswerWritten = document.getElementById('custom_question_answer'),
    questionDifficulty = document.getElementById('custom_question_difficulty'),
    customQuestion = document.querySelector('#custom_question');
    const isCorrectAnswer = document.querySelectorAll('.isCorrect');
    // custom question form formatting
    if(customQuestion.value === "" || customQuestionType.value === ""){
        // set error message to reflect something was left empty
            console.log('empty something or another');
            return;
        }
    let data = {
        question: customQuestion.value,
        type: customQuestionType.value,
        difficulty: questionDifficulty.value
    }

    if(customQuestionType.value === "text"){
        // add ability to add multiple acceptable answers handle that here
        data.answers = customAnswerWritten.value.split("~").filter(s => s);
    } else {
        let answers = [];
        for(let i = 0; i < customAnswerMultiple.length; i++){
            let data = {
                answer: customAnswerMultiple[i].value,
                isCorrect: isCorrectAnswer[i].checked
            }
            answers.push(data);
        }
        data.answers = answers;
    }
    //reset form inputs to be empty
    // display updated quiz
    newQuiz.push(data);
    prepareQuiz(newQuiz);
}

// check if user wants to make a custom trivia quiz
async function prepareQuiz(quiz){
    let isCustom = quizType.checked;
    let triviaObj = {
        title: quizName.value,
        difficulty: quizDifficulty.value,
        quiz: [],
    };
    if(quizName.value === ""){
        return "Please enter a quiz name";
    }
    
    if(!isCustom){
        let request;
        if(quizDifficulty.value === "mixed"){
            request = await axios.get(`https://opentdb.com/api.php?amount=${questionTotal.value}`);
            triviaObj.quiz = formatResponse(request.data.results);
        } else {
            request = await axios.get(`https://opentdb.com/api.php?amount=${questionTotal.value}&difficulty=${quizDifficulty.value}`);
            triviaObj.quiz = request.data.results;
        }
    } else {
        triviaObj.quiz = quiz;
    }
    // render the quiz as it is currently set
    renderQuiz(triviaObj);
    return triviaObj;
}

function formatResponse(questions){
    let result = [];
    for(let i = 0; i < questions.length; i++){
        let question = {
            question: questions[i].question,
            type: questions[i].type,
            difficulty: questions[i].difficulty,
            answers: []
        }
    //combine correct and incorrect answers into one answer array
        question.answers.push({
            answer: questions[i].correct_answer,
            isCorrect: true,
        });
        questions[i].incorrect_answers.forEach((item) => {
            question.answers.push({
                answer: item,
                isCorrect: false,
            });
        });
        result.push(question);
    }
    return result;
}

quizSubmit.addEventListener('click', async (e) => {
    let quiz = await prepareQuiz(newQuiz);
    // handle form input errors eg: no name, no questions, etc
    if(typeof quiz !== "object"){
        // set error message
        return;
    }
    try{
        // save generated quiz to database
        await axios.request({
            method: "post",
            url: "/new/quiz",
            data: quiz,
        }).then((res) => {
            quizList.push({id: res.data, title: quiz.title, length: quiz.quiz.length});
        });
        renderQuiz(quiz);
    } catch(err){
        console.log(err);
    }
});

//display created quiz

function renderQuiz(quiz){
    const quizDisplay = document.getElementById('created_quiz_display'),
          quizName = document.getElementById('created_quiz_name'),
          quizDifficulty = document.getElementById('created_quiz_difficulty');
    let result = [];
    // console.log('render', quiz);
    quizName.innerText = quiz.title;
    quizDifficulty.innerText = quiz.difficulty;
    displayQuestion(quiz.quiz);
}

function displayQuestion(questions){
    const quizQuestions = document.getElementById('created_quiz_questions');
    // clear questions already rendered so you don't have duplicated question/answers
    quizQuestions.innerHTML = "";
    for(let i = 0; i < questions.length; i++){
        let container = document.createElement('li'),
            header = document.createElement('h4'),
            li = document.createElement('li');
            header.innerText = `${questions[i].question}`
            quizQuestions.appendChild(header);
            // console.log(typeof questions[i].answers);
            // for written question answers
            if(typeof questions[i].answers === "string"){
                //filter will remove the empty string at the end of the split array because an empty string ("") is falsy 
                quizQuestions.appendChild(displayAnswers(questions[i].answers.split("~").filter(s => s)));
            } else {
                quizQuestions.appendChild(displayAnswers(questions[i].answers));
            }
            // customQuestionType.value === "multiple" ?
                //  quizQuestions.appendChild(displayAnswer(questions[i].answers))
            
    }
}

function displayAnswers(answers){
    // console.log(answers.length);
    let container = document.createElement('ul');
    for(let i = 0; i < answers.length; i++){
        let li = document.createElement('li');
        li.innerText = answers[i].answer || answers[i];
        // check if it's the correct answer and add a correct answer class 
        container.appendChild(li);

    }
    return container;
}


