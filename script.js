document.addEventListener("DOMContentLoaded", function () {
  // Only initialize dashboard elements if we're on the dashboard page
  if (window.location.pathname.includes("dashboard.html")) {
    // Dashboard Elements
    const balanceElement = document.getElementById("current-balance");
    const transactionType = document.getElementById("transaction-type");
    const amountInput = document.getElementById("amount");
    const makeTransactionButton = document.getElementById("make-transaction");
    const transactionList = document.getElementById("transaction-list");
    const logoutButton = document.getElementById("logout-button");
    const userDisplay = document.getElementById("user-display");
    const accountNumber = document.getElementById("accountNumber");
    const branchName = document.getElementById("branchName");
    const nameElement = document.getElementById("name");
    const dobElement = document.getElementById("dob");
    const genderElement = document.getElementById("gender");
    const addressElement = document.getElementById("address");

    // Initialize dashboard
    loadDashboard();

    // Transaction handler
    if (makeTransactionButton) {
      makeTransactionButton.addEventListener("click", function () {
        const transactionAmount = parseFloat(amountInput.value);
        const selectedType = transactionType.value;

        if (!transactionAmount || transactionAmount <= 0) {
          alert("Please enter a valid amount.");
          return;
        }

        const currentUser = sessionStorage.getItem("currentUser");
        const users = JSON.parse(localStorage.getItem("users")) || {};
        const userData = users[currentUser];

        if (selectedType === "withdraw" && transactionAmount > userData.balance) {
          alert("Insufficient balance for withdrawal.");
          return;
        }

        // Update balance
        if (selectedType === "deposit") {
          userData.balance += transactionAmount;
        } else if (selectedType === "withdraw") {
          userData.balance -= transactionAmount;
        }

        // Record transaction
        userData.transactions.push({ type: selectedType, amount: transactionAmount });

        // Save and refresh dashboard
        saveUserData(currentUser, userData);
        loadDashboard();
      });
    }

    // Logout handler
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem("currentUser");
        window.location.href = 'login.html';
      });
    }
  }

  

  // Login form handler
  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      console.log("Login attempted for username:", username);

      const users = JSON.parse(localStorage.getItem("users")) || {};
      const userData = users[username];

      console.log("Found user data:", userData);

      if (userData && userData.password === password) {
        sessionStorage.setItem("currentUser", username);
        console.log("Login successful, redirecting to dashboard");
        window.location.href = 'dashboard.html';
      } else {
        alert("Invalid username or password");
      }
    });
  }

  // Register form handler
  const registerForm = document.querySelector("#register-form");
    if (registerForm) {
        console.log("Register form found");
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput = document.getElementById("confirm-password");
            
            if (!usernameInput || !passwordInput || !confirmPasswordInput) {
                console.error("Required form elements not found");
                return;
            }

            const username = usernameInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validation
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            // Check if username exists
            const users = JSON.parse(localStorage.getItem("users")) || {};
            if (users[username]) {
                alert("Username already exists. Please choose another.");
                return;
            }

            // Store registration data in sessionStorage
            sessionStorage.setItem("pendingUsername", username);
            sessionStorage.setItem("pendingPassword", password);
            
            console.log("Registration data stored, redirecting to user details...");
            window.location.href = 'user-details.html';
        });
    }
    const userDetailsForm = document.querySelector("#user-details-form");
    if (userDetailsForm) {
        console.log("User details form found");

        const pendingUsername = sessionStorage.getItem("pendingUsername");
        const pendingPassword = sessionStorage.getItem("pendingPassword");

        if (!pendingUsername || !pendingPassword) {
            alert("Please register first");
            window.location.href = 'register.html';
            return;
        }

        userDetailsForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("name");
            const dobInput = document.getElementById("dob");
            const genderInput = document.getElementById("gender");
            const addressInput = document.getElementById("address");

            if (!nameInput || !dobInput || !genderInput || !addressInput) {
                console.error("Required user details form elements not found");
                return;
            }

            const userData = {
                username: pendingUsername,
                password: pendingPassword,
                accountNumber: generateAccountNumber(),
                branchName: "Main Branch",
                name: nameInput.value,
                dob: dobInput.value,
                gender: genderInput.value,
                address: addressInput.value,
                balance: 0,
                transactions: []
            };

            // Save user data
            const users = JSON.parse(localStorage.getItem("users")) || {};
            users[pendingUsername] = userData;
            localStorage.setItem("users", JSON.stringify(users));

            // Clean up session storage
            sessionStorage.removeItem("pendingUsername");
            sessionStorage.removeItem("pendingPassword");

            alert("Registration complete! Please login.");
            window.location.href = 'login.html';
        });
    }
});

// Helper functions
function generateAccountNumber() {
  return Math.floor(Math.random() * 9000000000) + 1000000000;
}

function updateTransactionHistory(transactions) {
  const transactionList = document.getElementById("transaction-list");
  if (!transactionList) return;
  
  transactionList.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.textContent = `Transaction ${index + 1}: ${transaction.type} ₹${transaction.amount}`;
    transactionList.appendChild(li);
  });
}

function loadDashboard() {
  const currentUser = sessionStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const userData = users[currentUser];

  if (!userData) {
    alert("User not found. Redirecting to login.");
    window.location.href = 'login.html';
    return;
  }

  // Display user data
  const elements = {
    "user-display": currentUser,
    "accountNumber": userData.accountNumber,
    "branchName": userData.branchName,
    "current-balance": userData.balance,
    "name": userData.name,
    "dob": userData.dob,
    "gender": userData.gender,
    "address": userData.address
  };

  for (const [id, value] of Object.entries(elements)) {
    const element = document.getElementById(id);
    if (element && value) element.textContent = value;
  }

  // Update transaction history
  updateTransactionHistory(userData.transactions);
}

function saveUserData(username, data) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  users[username] = data;
  localStorage.setItem("users", JSON.stringify(users));
}

// Default user data structure
const defaultUserData = {
  accountNumber: "",
  branchName: "",
  balance: 0,
  transactions: [],
  name: "",
  dob: "",
  gender: "",
  address: ""
};