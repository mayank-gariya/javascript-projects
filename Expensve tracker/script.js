// DOM Elements
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const transactionForm = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const listEl = document.getElementById('list');

// Initialize transactions array from localStorage (or empty array if none exist)
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction via form submit
function addTransaction(e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: textInput.value,
        amount: +amountInput.value, // converts string to number
        category: categorySelect.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Clear form inputs
    textInput.value = '';
    amountInput.value = '';
    categorySelect.value = 'General';
}

// Generate random ID for each transaction
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list view
function addTransactionDOM(transaction) {
    // Determine whether it's positive (plus) or negative (minus)
    const sign = transaction.amount < 0 ? '-' : '+';
    const itemClass = transaction.amount < 0 ? 'minus' : 'plus';
    
    // Format amount with currency symbol and remove negative sign for display string
    const formattedAmount = `${sign}₹${Math.abs(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const li = document.createElement('li');
    li.classList.add(itemClass);

    li.innerHTML = `
        <div class="item-info">
            <span class="item-title">${escapeHtml(transaction.text)}</span>
            <span class="item-category">${escapeHtml(transaction.category)}</span>
        </div>
        <div class="item-right">
            <span class="item-amount">${formattedAmount}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fa-solid fa-xmark"></i></button>
        </div>
    `;

    listEl.appendChild(li);
}

// Update the balance, income, and expense summaries
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balanceEl.innerText = `₹${Number(total).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    totalIncomeEl.innerText = `₹${Number(income).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    totalExpenseEl.innerText = `₹${Number(expense).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Update local storage data
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Basic helper to prevent XSS injection from user input
function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Initialize application state
function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Run app init on load
init();

// Event Listener for Form Submission
transactionForm.addEventListener('submit', addTransaction);