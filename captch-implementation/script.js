const form = document.querySelector("#registerForm");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const captchaInput = document.querySelector("#captchaInput");

const captchaText = document.querySelector("#captchaText");
const refreshButton = document.querySelector("#refreshCaptcha");

const successCard = document.querySelector("#successCard");
const userName = document.querySelector("#userName");
const quoteText = document.querySelector("#quoteText");
const backButton = document.querySelector("#backButton");
const logsContainer = document.getElementById('logsContainer');

let history = JSON.parse(localStorage.getItem("userLogs")) || [];

let generatedCaptcha = "";

function generateCaptcha() {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    generatedCaptcha = "";

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        generatedCaptcha += characters[randomIndex];
    }

    captchaText.textContent = generatedCaptcha;
}

// Validation Functions

function validateName(name) {
    if (name.trim() === "") {
        return "Name field cannot be empty.";
    }

    return true;
}

function validateEmail(email) {
    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
}

function validatePassword(password, confirmPassword) {
    if (!password || !confirmPassword) {
        return "Password cannot be empty.";
    }

    if (password.length < 5) {
        return "Password should be at least 5 characters.";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }

    return true;
}

function validateCaptcha(userCaptcha) {
    return userCaptcha === generatedCaptcha;
}

// Event Listeners

refreshButton.addEventListener("click", () => {
    generateCaptcha();
    captchaInput.value = "";
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const userCaptcha = captchaInput.value.trim();

    const nameResult = validateName(name);
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password, confirmPassword);
    const captchaResult = validateCaptcha(userCaptcha);

    if (nameResult !== true) {
        alert(nameResult);
        return;
    }

    if (!emailResult) {
        alert("Invalid email address.");
        return;
    }

    if (passwordResult !== true) {
        alert(passwordResult);
        return;
    }

    if (!captchaResult) {
        alert("Incorrect CAPTCHA.");

        generateCaptcha();
        captchaInput.value = "";
        return;
    }

    popup();
});

generateCaptcha();

const popup = function(){
    form.classList.add("hidden");
    successCard.classList.remove("hidden");

    userName.textContent = name
    quote()

    backButton.addEventListener("click", () => {
        storeInformation()
        successCard.classList.add("hidden");
        form.classList.remove("hidden");
        form.reset();
        generateCaptcha();
    });

}

const quote = async function(){
    try {
        const res = await fetch('https://dummyjson.com/quotes/random');
        const data = await res.json();
        
        quoteText.textContent = `${data.quote}" - written by ${data.author}`;
 
    }catch (error) {
        console.error("Error fetching the quote:", error);
        quoteText.textContent = "Could not load quote.";
    }
}

function renderLogs() {
    // Clear previous logs
    logsContainer.innerHTML = '';

    if (history.length === 0) {
        logsContainer.innerHTML = '<p style="color: #888; font-style: italic;">No registrations logged yet.</p>';
        return;
    }

    // Render from newest to oldest
    const reversedHistory = [...history].reverse();

    reversedHistory.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        
        logItem.innerHTML = `
            <p><strong>Name:</strong> ${log.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${log.email}</p>
            <p class="log-time"><em>${log.register_at}</em></p>
        `;
        logsContainer.appendChild(logItem);
    });
}

// Updated storeInformation function
const storeInformation = function(e) {
    if (e) e.preventDefault(); 

    // 1. Create the user log object (grabbing current input values)
    const userlog = {
        'name': nameInput.value,
        'email': emailInput.value,
        'quote': quoteText.textContent,
        'register_at': new Date().toLocaleString()
    };

    // 2. Push log to the array
    history.push(userlog);

    // 3. Save to localStorage
    localStorage.setItem("userLogs", JSON.stringify(history));
    renderLogs();
};

// --- Your Submit Event Listener ---
// const registerForm = document.getElementById('registerForm');
// registerForm.addEventListener('submit', (e) => {
//     storeInformation(e);
    
//     // Show the success card
//     document.getElementById('userName').textContent = nameInput.value;
//     document.getElementById('successCard').classList.remove('hidden');
//     registerForm.parentElement.classList.add('hidden'); 
// });

document.addEventListener('DOMContentLoaded', renderLogs);