import './style.css'

import { Questions } from "./questions"
console.log(Questions)

const app = document.querySelector("#app")

const TIMEOUT = 4000;


/**
 * app.innerHTML = `<div>
    <h1>Salut</h1>
    <input />
</div>`;

const div = document.createElement("div")
console.log({
    parent: div.parentElement,
    contenue: div.innerHTML,
})

const title = document.createElement("h1");
title.innerText = "Jordan !";
title.className = "big-title";
title.style.background = "blue";
div.appendChild(title);

const input = document.createElement("input");
div.appendChild(input)

app.appendChild(div)

let i =0;

startButton.addEventListener("click", () => {
    const question = document.querySelector("#question") ?? document.createElement("p")
    question.id = "question";
    question.innerText = Questions[i].question;
    app.insertBefore(question, startButton)

    i++;
    if (i > Questions.length -1){
        console.log("Questions remove")
        question.remove()
        i = 0;
    }
})
 */

const startButton = document.querySelector("#start")

startButton.addEventListener("click", startQuiz)


function startQuiz(event){
    console.log(event.currentTarget)
    event.stopPropagation();
    let currentQuestion = 0;
    let score = 0;

    clean();
    displayQuestion(currentQuestion)

    function clean(){
        while(app.firstElementChild){
            console.log(app.firstElementChild)
            app.firstElementChild.remove();
        }
        const progress = getProgressBar(Questions.length, currentQuestion);
        app.appendChild(progress);
    }

    function displayQuestion(index){
        const question = Questions[index];
        clean();
        if(!question){
            DisplayfinishMessage();
            return;
        }
        const title = getTitleElement(question.question);
        app.appendChild(title)

        const answerDiv = createAnswers(question.answers);
        app.appendChild(answerDiv);

        const submitButton = getSubmitButton();

        submitButton.addEventListener("click", submit);

        app.appendChild(submitButton)
    }


    function DisplayfinishMessage(){
        const h1 = document.createElement("h1");
        h1.innerText = "Bravo! tu as termine le quiz.";
        const p = document.createElement("p");
        p.innerText = `tu as eu ${score} sur ${Questions.length} points !`

        app.appendChild(h1);
        app.appendChild(p);
    }

    function submit(){
        const selectedAnswer = app.querySelector('input[name="answer"]:checked');

        disableAllAnswers();

        const value = selectedAnswer.value;

        const question = Questions[currentQuestion];
        
        const isCorrect = question.correct === value;

        if (isCorrect){
            score++;
        }

        showFeedback(isCorrect, question.correct, value);
        const feedback = getFeedbackMessage(isCorrect, question.correct);
        app.appendChild(feedback)

        displayNextQuestionButton(() => {
            currentQuestion++;
            displayQuestion(currentQuestion);
        });
    }


    function showFeedback(isCorrect, correct, answer){

        const correctAnswerId = formatId(correct);
        const correctElement = document.querySelector(
            `label[for="${correctAnswerId}"]`
        );

        const selectedAnswerId = formatId(answer);
        const selectedElement = document.querySelector(
            `label[for="${selectedAnswerId}"]`
        );

        correctElement.classList.add("correct");
        selectedElement.classList.add(isCorrect ?"correct" : "incorrect");
    }

    function getFeedbackMessage(isCorrect, correct){
        const paragraph = document.createElement("p")
        paragraph.innerText = isCorrect ? "Bravo tu as trouve la bonne reponse. Attendez la prochaine question" 
        : `Desole..... c'est pas la bonne reponse mais plutot: ${correct}. Attendez la prochaine question`;

        return paragraph;
    }

    function createAnswers(answers){
        const answerDiv = document.createElement("div");

        answerDiv.classList.add("answers");

        for (const answer of answers){
            const label = getAnswerElement(answer)
            answerDiv.appendChild(label);
        }
        return answerDiv;
    }
}

function getTitleElement(text){
    const title = document.createElement("h3")
    title.innerText = text;
    return title;
}

function formatId(text) {
    return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase();
}

function getAnswerElement(text){
    const label = document.createElement("label");
    label.innerText = text;

    const input = document.createElement("input");
    const id = formatId(text);
    input.id = id;
    label.htmlFor = id;
    input.setAttribute("type", "radio");
    input.setAttribute("name", "answer");
    input.setAttribute("value", text);
    label.appendChild(input);

    return label;
}

function getSubmitButton() {
    const submitButton = document.createElement("button")
    submitButton.innerText = "Submit";
    return submitButton;
}

function getProgressBar(max, value){
        const progress = document.createElement("progress");
        progress.setAttribute("max", max);
        progress.setAttribute("value", value);
        return progress;
}

function displayNextQuestionButton(callback){
        let remainingTimeOut = TIMEOUT;

        app.querySelector("button").remove();

        const getButtonText = () => `Next (${remainingTimeOut/1000}s)`;

        const nextButton = document.createElement("button");
        nextButton.innerText = getButtonText();
        app.appendChild(nextButton);

        const interval = setInterval(() => {
            remainingTimeOut -= 1000;
            nextButton.innerText = getButtonText();
        }, 1000);

        const timeOut = setTimeout(() => {
            handleNextQuestion()
        }, TIMEOUT)

        const handleNextQuestion = () => {
            clearInterval(interval);
            clearTimeout(timeOut)
            callback()
        }
        
        nextButton.addEventListener("click", () =>{
            handleNextQuestion()
        })
    }

function disableAllAnswers(){
    const radioInputs = document.querySelectorAll('input[type="radio"]')

    for (const radio of radioInputs){
        radio.disabled = true;
    }
}
