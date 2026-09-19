const wordBank = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
    "coding", "with", "flask", "and", "tailwind", "css", "is", "an",
    "absolute", "breeze", "for", "rapid", "prototyping", "monkeytype",
    "clone", "javascript", "developer", "interface", "keyboard", "speed"
];

const punctuationList = [".", ",", "!", "?", ";", ":", "-", '"', "'"];

const quoteBank = [
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "The way to get started is to quit talking and begin doing.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
    "Life is what happens when you're busy making other plans.",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier."
];

const hiddenInput = document.querySelector('#hidden-input');
const wordDisplay = document.querySelector('#word-display');
const resetBtn = document.querySelector('#reset-btn');
const timerDisplay = document.querySelector('#timer');
const timeButtons = document.querySelectorAll('.time-btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const typeButtons = document.querySelectorAll('.type-btn');
const timeOptionsContainer = document.querySelector('#time-options');

let letterElements = [];
let currentIndex = 0;
let timer = 30;
let timeLeft = 30;
let timerInterval = null;
let isStarted = false;
let correctChars = 0;
let totalTyped = 0;

// Config states
let usePunctuation = false;
let useNumbers = false;
let currentTestType = 'time'; // 'time' or 'quote'

// Handle Time Selection Buttons
timeButtons.forEach(button => {
    button.addEventListener('click', () => {
        timeButtons.forEach(btn => {
            btn.classList.remove('text-[#e2b714]', 'font-bold');
            btn.classList.add('hover:text-[#e2b714]');
        });
        button.classList.add('text-[#e2b714]', 'font-bold');
        button.classList.remove('hover:text-[#e2b714]');

        timer = parseInt(button.dataset.time);
        timeLeft = timer;
        resetTest();
    });
});

// Handle Test Type selection (time vs quote)
typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        typeButtons.forEach(btn => {
            btn.classList.remove('text-[#e2b714]', 'font-semibold');
            btn.classList.add('hover:text-[#d1d0c5]');
        });
        button.classList.add('text-[#e2b714]', 'font-semibold');
        button.classList.remove('hover:text-[#d1d0c5]');

        currentTestType = button.dataset.type;

        // Show/Hide timer button options depending on mode
        if (currentTestType === 'quote') {
            timeOptionsContainer.style.display = 'none';
            timerDisplay.style.opacity = '0';
        } else {
            timeOptionsContainer.style.display = 'flex';
            timerDisplay.style.opacity = '1';
        }

        resetTest();
    });
});

// Handle Punctuation & Numbers Mode Toggles
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;

        if (mode === 'punctuation') {
            usePunctuation = !usePunctuation;
        } else if (mode === 'numbers') {
            useNumbers = !useNumbers;
        }

        button.classList.toggle('text-[#e2b714]');
        button.classList.toggle('hover:text-[#d1d0c5]');
        
        resetTest();
    });
});

// Generate random words or quote text dynamically
function generateTestText() {
    wordDisplay.innerHTML = '';
    let selectedWords = [];

    if (currentTestType === 'quote') {
        // Pick a random quote from quoteBank
        const randomQuote = quoteBank[Math.floor(Math.random() * quoteBank.length)];
        selectedWords = randomQuote.split(' ');
    } else {
        // Standard word generation
        for (let i = 0; i < 25; i++) {
            let randomIndex = Math.floor(Math.random() * wordBank.length);
            let word = wordBank[randomIndex];

            if (useNumbers && Math.random() < 0.20) {
                word = Math.floor(Math.random() * 1000).toString();
            }

            if (usePunctuation && Math.random() < 0.35) {
                const randPunct = punctuationList[Math.floor(Math.random() * punctuationList.length)];
                if (Math.random() < 0.5) {
                    word = word.charAt(0).toUpperCase() + word.slice(1);
                }
                word += randPunct;
            }

            selectedWords.push(word);
        }
    }

    selectedWords.forEach((word, wordIdx) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word flex';
        
        for (let char of word) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter text-[#646669] transition-colors duration-75';
            letterSpan.textContent = char;
            wordDiv.appendChild(letterSpan);
        }

        if (wordIdx < selectedWords.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'letter text-[#646669] px-1';
            spaceSpan.textContent = ' ';
            wordDiv.appendChild(spaceSpan);
        }

        wordDisplay.appendChild(wordDiv);
    });

    letterElements = document.querySelectorAll('.letter');
    currentIndex = 0;
    if (letterElements.length > 0) {
        letterElements[0].classList.add('cursor-active');
    }
}

function focusInput() {
    hiddenInput.focus();
}

function startTimer() {
    if (isStarted) return;
    isStarted = true;
    
    // Quotes mode don't use countdown timers usually, or timer counts up. Let's make it count down if in time mode.
    if (currentTestType === 'time') {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endTest();
            }
        }, 1000);
    }
}

// Handle Keydown (Backspace & Tab)
hiddenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
        e.preventDefault();
        
        if (currentIndex > 0) {
            letterElements[currentIndex].classList.remove('cursor-active');
            currentIndex--;
            letterElements[currentIndex].className = 'letter text-[#646669] cursor-active';
            
            if (hiddenInput.value.length > 0) {
                hiddenInput.value = hiddenInput.value.slice(0, -1);
            }
        }
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        resetTest();
    }
});

// Handle typing input
hiddenInput.addEventListener('input', () => {
    if (!isStarted) startTimer();

    const typedValue = hiddenInput.value;
    if (typedValue.length === 0) return;
    
    const typedChar = typedValue[typedValue.length - 1];

    if (currentIndex < letterElements.length) {
        letterElements[currentIndex].classList.remove('cursor-active');

        const targetChar = letterElements[currentIndex].textContent;
        totalTyped++;

        if (typedChar === targetChar) {
            letterElements[currentIndex].classList.add('text-[#d1d0c5]');
            letterElements[currentIndex].classList.remove('text-[#646669]', 'text-red-500');
            correctChars++;
        } else {
            letterElements[currentIndex].classList.add('text-red-500');
            letterElements[currentIndex].classList.remove('text-[#646669]', 'text-[#d1d0c5]');
        }

        currentIndex++;

        if (currentIndex < letterElements.length) {
            letterElements[currentIndex].classList.add('cursor-active');
        } else {
            clearInterval(timerInterval);
            endTest();
        }
    }
});

function endTest() {
    hiddenInput.blur();
    
    const timeSpent = currentTestType === 'time' ? (timer - timeLeft) : 5; // fallback calculation for quote
    const minutes = Math.max(timeSpent, 1) / 60;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;

    wordDisplay.innerHTML = `
        <div class="flex flex-col items-center justify-center w-full gap-4 text-center">
            <div class="flex gap-12">
                <div>
                    <div class="text-sm text-[#646669]">wpm</div>
                    <div class="text-5xl text-[#e2b714] font-bold">${wpm}</div>
                </div>
                <div>
                    <div class="text-sm text-[#646669]">accuracy</div>
                    <div class="text-5xl text-[#e2b714] font-bold">${accuracy}%</div>
                </div>
            </div>
        </div>
    `;
    timerDisplay.textContent = "0";
}

function resetTest() {
    clearInterval(timerInterval);
    isStarted = false;
    timeLeft = timer;
    timerDisplay.textContent = timeLeft;
    hiddenInput.value = '';
    correctChars = 0;
    totalTyped = 0;
    generateTestText();
    focusInput();
}

resetBtn.addEventListener('click', resetTest);

window.onload = () => {
    resetTest();
};