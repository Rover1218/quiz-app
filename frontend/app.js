// Add at the beginning of your file
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const resultSound = document.getElementById('resultSound');
const backgroundMusic = document.getElementById('backgroundMusic');
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');

const settingsForm = document.getElementById('settings-form');
const quizSettings = document.getElementById('quiz-settings');
const quizBox = document.getElementById('quiz-box');

let isSoundEnabled = true;
let quizStarted = false;

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    soundIcon.className = isSoundEnabled ? 'fas fa-volume-up text-gray-700' : 'fas fa-volume-mute text-gray-700';

    if (!isSoundEnabled) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
}

function playSound(sound) {
    if (isSoundEnabled && sound) {
        sound.currentTime = 0;
        sound.play();
    }
}

// Add event listener for sound toggle
soundToggle.addEventListener('click', toggleSound);

// Update API URL to use local backend
const API_URL = 'https://quiz-app-rust-sigma.vercel.app'; // Ensure this matches your backend
const questionBox = document.getElementById('question');
const optionsBox = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const scoreDisplay = document.getElementById('score');
const loader = document.getElementById('loader');
const replayButton = document.getElementById('replay-btn');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Add error handling for API requests
async function fetchQuestions() {
    quizBox.style.display = 'none';
    loader.style.display = 'flex';

    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const amount = document.getElementById('questionCount').value;
    const type = document.getElementById('questionType').value; // Add this line

    try {
        const response = await fetch(`${API_URL}/questions?category=${category}&difficulty=${difficulty}&amount=${amount}&type=${type}`); // Corrected endpoint
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid question data');
        }

        questions = data;

        loader.style.display = 'none';
        quizBox.style.display = 'block';
        questionBox.style.display = 'block';
        optionsBox.style.display = 'grid';

        loadQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        loader.style.display = 'none'; // Hide loader on error
        questionBox.style.display = 'block';
        questionBox.innerHTML = `
            <div class="text-center space-y-4">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                <p class="text-gray-700">Failed to load questions. Please try again.</p>
                <button onclick="location.reload()" class="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                    <i class="fas fa-redo mr-2"></i> Retry
                </button>
            </div>
        `;
    }
}

// Load a question into the quiz box
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showScore();
        return;
    }

    const question = questions[currentQuestionIndex];
    // Decode question text
    questionBox.innerHTML = decodeHTML(question.question_text);
    optionsBox.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = `w-full p-4 text-left rounded-xl transition-all duration-200 
            bg-white hover:bg-gray-50 border border-gray-200 
            hover:shadow-md hover:-translate-y-1 transform 
            flex items-center space-x-3 focus:outline-none focus:ring-2 
            focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`;

        button.innerHTML = `
            <span class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">${letters[index]}</span>
            <span class="flex-1">${decodeHTML(option)}</span>
        `;

        button.onclick = () => checkAnswer(index, question.correct_option);
        optionsBox.appendChild(button);
    });

    // Reset UI state
    nextButton.style.display = 'none';
    questionBox.classList.add('animate__animated', 'animate__fadeIn');
    updateProgressBar();
}

function checkAnswer(selectedIndex, correctIndex) {
    const buttons = optionsBox.getElementsByTagName('button');

    // Prevent multiple answers
    if (nextButton.style.display === 'block') return;

    const isCorrect = selectedIndex === correctIndex;

    // Update button styles
    Array.from(buttons).forEach((button, index) => {
        button.disabled = true;
        if (index === selectedIndex) {
            button.className += isCorrect ?
                ' bg-green-100 border-green-500 text-green-700' :
                ' bg-red-100 border-red-500 text-red-700';
        }
        if (index === correctIndex && !isCorrect) {
            button.className += ' bg-green-100 border-green-500 text-green-700';
        }
    });

    // Show notification and update score
    showNotification(
        isCorrect ? 'Correct! 🎉' : 'Wrong answer! 😕',
        isCorrect
    );

    if (isCorrect) {
        score++;
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#4F46E5', '#818CF8', '#C7D2FE']
        });
        playSound(correctSound);
    } else {
        playSound(wrongSound);
    }

    // Show next button
    nextButton.style.display = 'block';
    nextButton.classList.add('animate__animated', 'animate__fadeIn');
}

// Show the user's final score
function showScore() {
    questionBox.style.display = 'none';
    optionsBox.style.display = 'none';
    nextButton.style.display = 'none';
    scoreDisplay.style.display = 'block';
    replayButton.style.display = 'block';

    const percentage = (score / questions.length) * 100;
    if (percentage > 70) {
        celebrateSuccess();
    }

    scoreDisplay.innerHTML = `
        <div class="space-y-6 animate__animated animate__fadeInUp">
            <h2 class="text-2xl font-bold text-gray-800">Quiz Complete!</h2>
            <div class="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
                <div class="text-3xl font-bold">${score}/${questions.length}</div>
                <div class="text-xl mt-2">${percentage}% Score</div>
            </div>
        </div>
    `;
    backgroundMusic.pause();
    playSound(resultSound);
}

function celebrateSuccess() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

replayButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.style.display = 'none';
    replayButton.style.display = 'none';
    quizSettings.style.display = 'block';
    quizBox.style.display = 'none';
    if (isSoundEnabled) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
    }
});

// Next question handler
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Decode HTML entities (Open Trivia DB encodes questions with entities like &#039;)
function decodeHTML(html) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
}

// Shuffle options array
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showNotification(message, isCorrect) {
    const notification = document.getElementById('notification');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 text-white transform transition-all duration-300 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`;

    notification.innerHTML = `
        <i class="fas fa-${isCorrect ? 'check' : 'times'}-circle"></i>
        <span>${message}</span>
    `;

    notification.style.transform = 'translateX(0)';
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, 2000);
}

function updateProgressBar() {
    const progress = document.getElementById('progress');
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    progress.style.width = `${progressPercentage}%`;
}

// Add retry functionality
const retryButton = document.getElementById('retry-btn');
if (retryButton) {
    retryButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        fetchQuestions();
        document.getElementById('score').style.display = 'none';
        questionBox.style.display = 'block';
        optionsBox.style.display = 'block';
    });
}

// Add form submit handler
settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    quizSettings.style.display = 'none';
    quizBox.style.display = 'block';
    quizStarted = true;
    fetchQuestions();
});

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
    quizBox.style.display = 'none';
    loader.style.display = 'none'; // Hide loader initially
    if (isSoundEnabled) {
        backgroundMusic.play();
    }
});
