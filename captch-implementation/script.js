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

// CAPTCHA

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
        
        quoteText.textContent = `"${data.quote}" - written by ${data.author}`;
 
    }catch (error) {
        console.error("Error fetching the quote:", error);
        quoteText.textContent = "Could not load quote.";
    }
}
