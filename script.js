let t = null;

const homeSection = document.querySelector('#homeSection');
const settingsSection = document.querySelector('#settingsSection');
const timerSection = document.querySelector('#timerSection');

const startPauseTimerButton = document.querySelector('#startTimer');
const resetButton = document.querySelector('#resetTimer');
const timerSeconds = document.querySelector('#timer');
const questionDiv = document.querySelector('#question');

let userSettings = {
    totalQuestions: 5, 
    secondsPerQuestion: 10, 
    level: "hard", 
    recording: false
}

let timer = {
    secondsRemaining: undefined,
    active: false,
    startTimer() {
        if (this.secondsRemaining == undefined) this.secondsRemaining = userSettings.secondsPerQuestion;
        this.active = true;
        
        // Updates buttons
        startPauseTimerButton.innerHTML = "Pause";
        resetButton.disabled = true;

        t = setInterval(() => {
            // Stops timer once reaches zero
            if (this.secondsRemaining <= 0) {
                clearInterval(t);
                this.active = false;
                resetButton.disabled = false;
                startPauseTimerButton.disabled = true;
            }
            else {
                this.secondsRemaining--;
                updateTimerText(this.secondsRemaining);
            }
        }, 1000);
    }, 
    pauseTimer() {
        clearInterval(t);
        this.active = false;
        
        if (this.secondsRemaining == 0) {
            startPauseTimerButton.disabled = true;
        }
        resetButton.disabled = false;
        startPauseTimerButton.innerHTML = "Start";
    }, 
    resetTimer() {
        clearInterval(t);
        this.active = false;
        if (this.secondsRemaining != undefined) this.secondsRemaining = undefined;
        updateTimerText(userSettings.secondsPerQuestion)
        
        // Edits buttons
        startPauseTimerButton.innerHTML = "Start";
        resetButton.disabled = true;
        startPauseTimerButton.disabled = false;
    }
};

// Sets timer on page load
timer.resetTimer();

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
        }
        else {
            nextQuestion(questions, questionCounter);
            
            document.querySelector('#nextQuestion').addEventListener("click", () => {
                questionCounter++;
                nextQuestion(questions, questionCounter);
                // TODO - add validation or helpful error message?
            })
            console.log(questions);
        }
        
        
    }) 

function getUserQuestions(userSettings, data) {
    // Need to fix to be length of questions chosen
    return data.reduce((array, element) => {
        console.log(element.level, userSettings.level)
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
}

function nextQuestion(questions, questionCounter) {

    timer.resetTimer();
    questionDiv.innerHTML = questions[questionCounter];

    // Hides button and disables it once we reach the end of questions array
    if (questionCounter === questions.length - 1) {
        hideElement(document.querySelector('#nextQuestion'));
        document.querySelector('#nextQuestion').disabled = true;
    }

}

function updateTimerText(seconds) {
    timerSeconds.innerHTML = seconds;
}

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

document.querySelector('#startTimer').addEventListener('click', () => {
    (timer.active) ? timer.pauseTimer() : timer.startTimer()
})

document.querySelector('#resetTimer').addEventListener('click', () => {
    timer.resetTimer();
})

document.querySelector('#start').addEventListener('click', () => {
    hideElement(homeSection);
    showElement(settingsSection);
})




