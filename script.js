let t = null;

const startPauseTimerButton = document.querySelector('#startTimer');
const resetButton = document.querySelector('#resetTimer');
const timerSeconds = document.querySelector('#timer');

let timer = {
    secondsPerQuestion: 5,
    questionsRemaining: 5,
    secondsRemaining: undefined,
    active: false,
    startTimer() {
        if (this.secondsRemaining == undefined) this.secondsRemaining = this.secondsPerQuestion;
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
        // Stops timer
        clearInterval(t);
        this.active = false;
        // Updates buttons
        resetButton.disabled = false;
        startPauseTimerButton.innerHTML = "Start";
    }, 
    resetTimer() {
        // Resets timer
        clearInterval(t);
        this.active = false;
        if (this.secondsRemaining != undefined) this.secondsRemaining = undefined;
        updateTimerText(this.secondsPerQuestion)
        // Edits buttons
        startPauseTimerButton.innerHTML = "Start";
        resetButton.disabled = true;
        startPauseTimerButton.disabled = false;
    }
}

timer.resetTimer();

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