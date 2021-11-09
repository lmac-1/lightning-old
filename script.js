let t = null;

/* 
TODO 
- Move the settings to an icon accessible from timer screen
- Make instructions go straight to timer
- 3 2 1 countdown first time on timer
- Timer will be active with start button activated
- Default settings will be all / infinitive
- We will ask on the instructions if they want to be recorded
*/

// Holds all DOM elements for each page used in JS
const pages = {
    home: {
        containerDiv: document.querySelector('#homeSection'),
        nextButton: document.querySelector('#homeNext')
    },
    instructions: {
        containerDiv: document.querySelector('#instructionsSection'),
        nextButton: document.querySelector('#instructionsNext'),
        backButton: document.querySelector('#instructionsBack')
    },
    settings: {
        containerDiv: document.querySelector('#settingsSection'),
        nextButton: document.querySelector('#settingsNext'),
        backButton: document.querySelector('#settingsBack')
    }, 
    timer: {
        containerDiv: document.querySelector('#timerSection'),
        backButton: document.querySelector('#timerBack'),
        startPauseTimerButton: document.querySelector('#startTimer'),
        resetButton: document.querySelector('#resetTimer'),
        timerSecondsText: document.querySelector('#timerSeconds'),
        questionText: document.querySelector('#question'),
        nextQuestionButton: document.querySelector('#nextQuestion')
    }
}

const defaultSettings = {
    totalQuestions: 5,
    secondsPerQuestion: 60, 
    level: "easy",
    recording: false
}

// Will be updated by what user chooses in form
let userSettings = {
    totalQuestions: defaultSettings.totalQuestions, 
    secondsPerQuestion: defaultSettings.secondsPerQuestion, 
    level: defaultSettings.level, 
    recording: defaultSettings.recording
}

// Holds all timer logic
let timer = {
    secondsRemaining: undefined,
    active: false,
    startTimer() {
        if (this.secondsRemaining == undefined) this.secondsRemaining = userSettings.secondsPerQuestion;
        this.active = true;
        
        // Updates buttons
        pages.timer.startPauseTimerButton.innerHTML = "Pause";
        pages.timer.resetButton.disabled = true;

        t = setInterval(() => {
            // Stops timer once reaches zero
            if (this.secondsRemaining <= 0) {
                clearInterval(t);
                this.active = false;
                pages.timer.resetButton.disabled = false;
                pages.timer.startPauseTimerButton.disabled = true;
                // Make it work for last question
                showElement(pages.timer.nextQuestionButton);
            }
            else {
                this.secondsRemaining--;
                updateTimerText(this.secondsRemaining);
            }
        }, 10);
    }, 
    pauseTimer() {
        clearInterval(t);
        this.active = false;
        
        if (this.secondsRemaining == 0) {
            pages.timer.startPauseTimerButton.disabled = true;
        }
        pages.timer.resetButton.disabled = false;
        pages.timer.startPauseTimerButton.innerHTML = "Start";
    }, 
    resetTimer() {
        clearInterval(t);
        this.active = false;
        if (this.secondsRemaining != undefined) this.secondsRemaining = undefined;
        updateTimerText(userSettings.secondsPerQuestion)
        
        // Edits buttons
        pages.timer.startPauseTimerButton.innerHTML = "Start";
        pages.timer.resetButton.disabled = true;
        pages.timer.startPauseTimerButton.disabled = false;
    }
};

function hideElement(element) {
    if (!element.classList.contains('d-none')) {
        element.classList.add('d-none');
    }
}

function showElement(element) {
    if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
    }
}

function getUserQuestions(userSettings, data) {
    // Need to fix to randomize
    let questions = data.reduce((array, element) => {

        if (userSettings.level === "all") {
            return array.concat(element.question);
        } 
        else if (element.level == userSettings.level) {
            return array.concat(element.question);
        } 
        else {
            return array;
        }
    }, []);

    if (userSettings.totalQuestions !== "") {
        return questions.slice(0, userSettings.totalQuestions);
    }

    return questions;
}

function nextQuestion(questions, questionCounter) {

    timer.resetTimer();
    pages.timer.questionText.innerHTML = questions[questionCounter];
    hideElement(pages.timer.nextQuestionButton);

    // Hides button and disables it once we reach the end of questions array
    if (questionCounter === questions.length - 1) {
        hideElement(document.querySelector('#nextQuestion'));
        document.querySelector('#nextQuestion').disabled = true;
    }

}

function updateTimerText(seconds) {
    pages.timer.timerSecondsText.innerHTML = seconds;
}

function setDefaultSettings() {
    document.querySelector('#secondsInput').value = defaultSettings.secondsPerQuestion;
    document.querySelector('#totalQuestionsInput').value = defaultSettings.totalQuestions;
    document.querySelector('#levelInput').value = defaultSettings.level;
    document.querySelector('#recordingInput').checked = defaultSettings.recording;
}

function updateUserSettings(userSettings, userInputs) {
    for (const property in userInputs) {
        userSettings[property] = userInputs[property];
    }
}

function updateQuestions(userSettings) {
    // json-server --watch db.json
    // temporary - only works locally
    fetch("http://localhost:3000/questions")
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        let questionCounter = 0;
        let questions = getUserQuestions(userSettings, data);

        if (questions.length == 0) {
            // todo - add validation message
            console.log("0 questions");
        }
        else {
            nextQuestion(questions, questionCounter);
            
            pages.timer.nextQuestionButton.addEventListener("click", () => {
                questionCounter++;
                nextQuestion(questions, questionCounter);
                // TODO - add validation or helpful error message?
            })
            console.log(questions);
        }
    }) 

}

// Sets timer and defaults on page load
timer.resetTimer();
setDefaultSettings()

pages.home.nextButton.addEventListener('click', () => {
    hideElement(pages.home.containerDiv);
    showElement(pages.instructions.containerDiv);
})

pages.instructions.nextButton.addEventListener('click', () => {
    hideElement(pages.instructions.containerDiv);
    showElement(pages.settings.containerDiv)
})

pages.instructions.backButton.addEventListener('click', () => {
    hideElement(pages.instructions.containerDiv);
    showElement(pages.home.containerDiv)
})

pages.settings.nextButton.addEventListener('click', () => {
    let inputs = {
        secondsPerQuestion: document.querySelector('#secondsInput').value,
        totalQuestions: document.querySelector('#totalQuestionsInput').value,
        level: document.querySelector('#levelInput').value,
        recording: document.querySelector('#recordingInput').checked
    }

    console.log(inputs);

    updateUserSettings(userSettings, inputs)
    updateQuestions(userSettings)
    hideElement(pages.settings.containerDiv);
    showElement(pages.timer.containerDiv);

})

/* document.querySelector('#resetDefaults').addEventListener('click', setDefaultSettings); */

pages.settings.backButton.addEventListener('click', () => {
    hideElement(pages.settings.containerDiv);
    showElement(pages.instructions.containerDiv);
})

pages.timer.backButton.addEventListener('click', () => {
    hideElement(pages.timer.containerDiv);
    showElement(pages.settings.containerDiv);
})

pages.timer.startPauseTimerButton.addEventListener('click', () => {
    (timer.active) ? timer.pauseTimer() : timer.startTimer()
})

pages.timer.resetButton.addEventListener('click', () => {
    timer.resetTimer();
})