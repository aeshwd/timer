// Timer Variables
let timer;
let timeRemaining;
let isWorkSession = true;
let currentCycle = 0;
let totalCycles = 0;
let isPaused = false;
let xp = 0;
let level = 1;

// Select Elements
const workInput = document.getElementById("work-duration");
const breakInput = document.getElementById("break-duration");
const longBreakInput = document.getElementById("long-break");
const cyclesInput = document.getElementById("cycles");
const alertSoundSelect = document.getElementById("alert-sound");
const timeDisplay = document.getElementById("time-display");
const sessionStatus = document.getElementById("session-status");
const motivationalPopup = document.getElementById("motivational-popup");
const motivationalText = document.getElementById("motivational-text");
const progressCircle = document.querySelector(".progress-ring__circle");
const alertSoundPlayer = document.getElementById("alert-sound-player");
const themeSelector = document.getElementById("themes");
const startButton = document.getElementById("start-timer");
const pauseButton = document.getElementById("pause-timer");
const resumeButton = document.getElementById("resume-timer");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const languageSelector = document.getElementById("language-selector");
const badgesContainer = document.getElementById("badges");

const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference}`;



// Translations
const translations = {
    en: {
        start: "Start Timer",
        focusTime: "Focus Time!",
        breakTime: "Break Time!",
        motivationalStart: "Time to focus! Let's go!",
        motivationalBreak: "Well Done! Take a short break.",
        motivationalWork: "Back to work! Keep pushing!",
        motivationalLongBreak: "Amazing! Enjoy a long break!",
    },
    es: {
        start: "Iniciar Temporizador",
        focusTime: "¡Tiempo de Enfoque!",
        breakTime: "¡Tiempo de Descanso!",
        motivationalStart: "¡Es hora de concentrarse! ¡Vamos!",
        motivationalBreak: "¡Bien hecho! Tómate un descanso.",
        motivationalWork: "¡De vuelta al trabajo! ¡Sigue adelante!",
        motivationalLongBreak: "¡Increíble! Disfruta de un descanso largo.",
    },
    // Add more languages
};

// Functions
function setProgress(value) {
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    updateGradient(value);
}

function updateGradient(value) {
    const percentage = (value / 100) * 360;
    progressCircle.style.stroke = `conic-gradient(
        #4caf50 ${percentage}deg,
        #ffa500 ${percentage}deg
    )`;
}

function updateTimeDisplay(minutes, seconds) {
    timeDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;
}

function showMotivationalPopup(message) {
    motivationalText.textContent = message;
    motivationalPopup.classList.remove("hidden");
    setTimeout(() => {
        motivationalPopup.classList.add("hidden");
    }, 3000);
}

function playAlertSound() {
    alertSoundPlayer.src = alertSoundSelect.value;
    alertSoundPlayer.play();
    setTimeout(() => {
        alertSoundPlayer.pause();
        alertSoundPlayer.currentTime = 0; // Stop after 3 seconds
    }, 3000);
}

function changeBackground(sessionType) {
    const backgrounds = {
        work: "linear-gradient(to right, #36d1dc, #5b86e5)",
        break: "linear-gradient(to right, #ff9966, #ff5e62)",
        longBreak: "linear-gradient(to right, #7f00ff, #e100ff)",
    };
    document.body.style.background = backgrounds[sessionType];
}

function unlockBadge(badgeId) {
    const badge = document.getElementById(badgeId);
    badge.style.display = "block";
    badge.classList.add("animate-badge");
    setTimeout(() => {
        badge.style.display = "none";
        badge.classList.remove("animate-badge");
    }, 5000);
}

function updateXP(minutes) {
    xp += minutes;
    if (xp >= level * 100) {
        level++;
        alert(`🎉 Level Up! You are now Level ${level}!`);
    }
}

function startTimer(duration, isWork) {
    timeRemaining = duration;
    isWorkSession = isWork;
    sessionStatus.textContent = isWork ? "Focus Time!" : "Break Time!";
    changeBackground(isWork ? "work" : "break");

    timer = setInterval(() => {
        if (!isPaused) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;

            updateTimeDisplay(minutes, seconds);
            setProgress((timeRemaining / duration) * 100);

            if (timeRemaining === 0) {
                clearInterval(timer);
                handleSessionEnd();
            }
            timeRemaining--;
        }
    }, 1000);
}

function handleSessionEnd() {
    playAlertSound();
    if (isWorkSession) {
        currentCycle++;
        updateXP(25); // Add XP for work session
        if (currentCycle >= 5) unlockBadge("badge-5-cycles");

        if (currentCycle % totalCycles === 0) {
            showMotivationalPopup("Amazing! Enjoy a long break!");
            startTimer(longBreakInput.value * 60, false);
            changeBackground("longBreak");
        } else {
            showMotivationalPopup("Well Done! Take a short break.");
            startTimer(breakInput.value * 60, false);
        }
    } else {
        showMotivationalPopup("Back to work! Keep pushing!");
        startTimer(workInput.value * 60, true);
    }
}

// Event Listeners
startButton.addEventListener("click", () => {
    if (timer) clearInterval(timer); // Reset previous timer

    const workDuration = parseInt(workInput.value) * 60;
    const cycles = parseInt(cyclesInput.value);
    totalCycles = cycles;
    currentCycle = 0;

    showMotivationalPopup("Time to focus! Let's go!");
    startTimer(workDuration, true);
});

pauseButton.addEventListener("click", () => {
    isPaused = true;
    pauseButton.classList.add("hidden");
    resumeButton.classList.remove("hidden");
});

resumeButton.addEventListener("click", () => {
    isPaused = false;
    resumeButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
});

languageSelector.addEventListener("change", (e) => {
    const selectedLang = e.target.value;
    const langData = translations[selectedLang];

    startButton.textContent = langData.start;
    sessionStatus.textContent = isWorkSession
        ? langData.focusTime
        : langData.breakTime;
    motivationalPopup.textContent = langData.motivationalStart;
});
