// // Utility: Clean input (remove non-alphanumerics, ignore case)
// function cleanInput(str) {
//     return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
// }

// // DOM Elements
// const form = document.getElementById('palindrome-form');
// const input = document.getElementById('input-text');
// const resultDiv = document.getElementById('result');
// const clearBtn = document.getElementById('clear-btn');
// const historyList = document.getElementById('history-list');
// const themeSwitch = document.getElementById('theme-switch');
// const body = document.body;

// let history = [];

// function isPalindrome(str) {
//     const cleaned = cleanInput(str);
//     if (!cleaned) return null; // invalid input
//     return cleaned === cleaned.split('').reverse().join('');
// }

// function addToHistory(inputValue, isPal) {
//     history.unshift({ input: inputValue, result: isPal });
//     if (history.length > 10) history.pop();
//     renderHistory();
// }

// function renderHistory() {
//     historyList.innerHTML = '';
//     history.forEach(item => {
//         const li = document.createElement('li');
//         li.textContent = `"${item.input}" → ${item.result ? 'Palindrome' : 'Not a palindrome'}`;
//         historyList.appendChild(li);
//     });
// }

// form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     const value = input.value.trim();
//     if (!value) {
//         resultDiv.textContent = 'Please enter some text.';
//         resultDiv.style.color = 'red';
//         return;
//     }
//     const pal = isPalindrome(value);
//     if (pal === null) {
//         resultDiv.textContent = 'Input must contain at least one letter or number.';
//         resultDiv.style.color = 'red';
//         return;
//     }
//     resultDiv.textContent = pal ? 'Palindrome' : 'Not a palindrome';
//     resultDiv.style.color = pal ? 'green' : 'crimson';
//     addToHistory(value, pal);
// });

// clearBtn.addEventListener('click', function() {
//     input.value = '';
//     resultDiv.textContent = '';
//     input.focus();
// });

// // Theme toggle
// function setTheme(dark) {
//     if (dark) {
//         body.classList.add('dark');
//         themeSwitch.checked = true;
//         localStorage.setItem('palindrome-theme', 'dark');
//     } else {
//         body.classList.remove('dark');
//         themeSwitch.checked = false;
//         localStorage.setItem('palindrome-theme', 'light');
//     }
// }

// themeSwitch.addEventListener('change', function() {
//     setTheme(themeSwitch.checked);
// });

// // On load: restore theme
// (function() {
//     const saved = localStorage.getItem('palindrome-theme');
//     setTheme(saved === 'dark');
// })(); 







// DOM Elements

const form = document.getElementById('palindrome-form');
const input = document.getElementById('input-text');
const resultDiv = document.getElementById('result-text');
const resultIcon = document.getElementById('result-icon');
const clearBtn = document.getElementById('clear-btn');
const clearHistoryBtn = document.getElementById('clear-history');
const historyList = document.getElementById('history-list');
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

let history = JSON.parse(localStorage.getItem('palindrome-history')) || [];

// Utility: Clean input (remove non-alphanumerics, ignore case)
function cleanInput(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function isPalindrome(str) {
    const cleaned = cleanInput(str);
    if (!cleaned) return null; // invalid input
    return cleaned === cleaned.split('').reverse().join('');
}

function showResult(isPal, message) {
    resultDiv.textContent = message;
    
    // Clear previous classes
    resultDiv.className = '';
    resultIcon.className = '';
    
    if (isPal === null) {
        // Invalid input
        resultDiv.classList.add('warning');
        resultIcon.classList.add('fas', 'fa-exclamation-triangle', 'warning');
        resultIcon.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
    } else if (isPal) {
        // Palindrome
        resultDiv.classList.add('success');
        resultIcon.classList.add('fas', 'fa-check-circle', 'success');
        resultIcon.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    } else {
        // Not a palindrome
        resultDiv.classList.add('error');
        resultIcon.classList.add('fas', 'fa-times-circle', 'error');
        resultIcon.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    }
}

function addToHistory(inputValue, isPal) {
    history.unshift({ 
        input: inputValue, 
        result: isPal,
        timestamp: new Date().toLocaleString()
    });
    
    if (history.length > 10) history.pop();
    saveHistory();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No history yet. Check some palindromes!';
        li.style.opacity = '0.7';
        li.style.fontStyle = 'italic';
        historyList.appendChild(li);
        return;
    }
    
    history.forEach(item => {
        const li = document.createElement('li');
        
        const textSpan = document.createElement('span');
        textSpan.textContent = `"${item.input}"`;
        
        const resultSpan = document.createElement('span');
        resultSpan.textContent = item.result ? 'Palindrome' : 'Not a palindrome';
        resultSpan.classList.add(item.result ? 'palindrome' : 'not-palindrome');
        
        const timeSpan = document.createElement('span');
        timeSpan.textContent = item.timestamp;
        timeSpan.style.opacity = '0.6';
        timeSpan.style.fontSize = '0.8rem';
        
        li.appendChild(textSpan);
        li.appendChild(resultSpan);
        li.appendChild(timeSpan);
        historyList.appendChild(li);
    });
}

function saveHistory() {
    localStorage.setItem('palindrome-history', JSON.stringify(history));
}

function clearHistory() {
    history = [];
    saveHistory();
    renderHistory();
}

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const value = input.value.trim();
    
    if (!value) {
        showResult(null, 'Please enter some text');
        return;
    }
    
    const pal = isPalindrome(value);
    
    if (pal === null) {
        showResult(null, 'Input must contain letters or numbers');
        return;
    }
    
    const message = pal 
        ? `"${value}" is a palindrome!` 
        : `"${value}" is not a palindrome`;
    
    showResult(pal, message);
    addToHistory(value, pal);
});

// Clear input
clearBtn.addEventListener('click', function() {
    input.value = '';
    resultDiv.textContent = '';
    resultIcon.className = '';
    input.focus();
});

// Clear history
clearHistoryBtn.addEventListener('click', clearHistory);

// Theme toggle
function setTheme(dark) {
    if (dark) {
        body.classList.add('dark');
        themeSwitch.checked = true;
        localStorage.setItem('palindrome-theme', 'dark');
    } else {
        body.classList.remove('dark');
        themeSwitch.checked = false;
        localStorage.setItem('palindrome-theme', 'light');
    }
}

themeSwitch.addEventListener('change', function() {
    setTheme(themeSwitch.checked);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        input.focus();
    }
});

// Initialize
(function() {
    // Restore theme
    const savedTheme = localStorage.getItem('palindrome-theme');
    setTheme(savedTheme === 'dark');
    
    // Render history
    renderHistory();
    
    // Focus input on load
    input.focus();
})();