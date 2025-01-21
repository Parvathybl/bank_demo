document.addEventListener("DOMContentLoaded", () => {
  // const userNameDisplay = document.getElementById("username");
  // const currentBalanceDisplay = document.getElementById("current-balance");
  // const transactionList = document.getElementById("transaction-list");
  // const transactionType = document.getElementById("transaction-type");
  // const amountInput = document.getElementById("amount");
  // const makeTransactionButton = document.getElementById("make-transaction");
  const logoutButton = document.getElementById("logout-button");

  const loggedInUser = sessionStorage.getItem("loggedInUser");

  if(loggedInUser) {
    window.location.href='home.html';
  }

  if(userNameDisplay)
  userNameDisplay.textContent = loggedInUser;


  const usersData = JSON.parse(localStorage.getItem("usersData")) || {};
  if (!usersData[loggedInUser]) {
    usersData[loggedInUser] = { balance: 0, transactions: [] };
    localStorage.setItem("usersData", JSON.stringify(usersData));
  }

  const userData = usersData[loggedInUser];

  const updateUI = () => {
    currentBalanceDisplay.textContent = userData.balance.toFixed(2);
    transactionList.innerHTML = "";
    userData.transactions.forEach((transaction, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${transaction.type.toUpperCase()} ₹${transaction.amount} - ${transaction.timestamp}`;
      transactionList.appendChild(li);
    });
  };

  makeTransactionButton.addEventListener("click", () => {
    const type = transactionType.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const timestamp = new Date().toLocaleString();

    if (type === "deposit") {
      userData.balance += amount;
      userData.transactions.push({ type, amount, timestamp });
      alert(`₹${amount.toFixed(2)} deposited successfully.`);
    } else if (type === "withdraw") {
      if (amount > userData.balance) {
        alert("Insufficient balance.");
        return;
      }
      userData.balance -= amount;
      userData.transactions.push({ type, amount, timestamp });
      alert(`₹${amount.toFixed(2)} withdrawn successfully.`);
    }

    localStorage.setItem("usersData", JSON.stringify(usersData));
    updateUI();
    amountInput.value = "";
  });

  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });

  updateUI();
});

const dropdown=document.querySelector('.signin');
const dropdownContent=document.querySelector('.dropdown-content');

dropdown.addEventListener('click', () => {
  console.log('Dropdown clicked');
  const isVisible=dropdownContent.style.display ==='block';
  dropdownContent.style.display=isVisible ? 'none' : 'block';
})

document.addEventListener('click', (event) => {
  if (!dropdown.contains(event.target) && !dropdownContent.contains(event.target)) {
    console.log('Clicked outside dropdown');
    dropdownContent.style.display='none';
  }
})

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  // Handle Register Form Submission
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (username && password) {
        const users = JSON.parse(localStorage.getItem("users")) || {};
        if (users[username]) {
          alert("Username already exists. Please try another.");
        } else {
          users[username] = password;
          localStorage.setItem("users", JSON.stringify(users));
          alert("Registration successful! You can now log in.");
          window.location.href = "login.html"; // Redirect to login page
        }
      }
    });
  }

  // Handle Login Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[username] && users[username] === password) {
        alert(`Welcome back, ${username}! Login successful.`);
        window.location.href = "index.html"; // Redirect to home page
      } else {
        alert("Invalid username or password. Please try again.");
      }
    });
  }
});


if (userDisplay) {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("You must log in first.");
    window.location.href = "login.html";
  } else {
    userDisplay.innerText = loggedInUser;
  }
}

// Logout Logic
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });
};

document.getElementById('viewTransactionHistory').addEventListener('click', function() {
  showSection('transactionHistory');
});

document.getElementById('deposit').addEventListener('click', function() {
  showSection('depositSection');
});

document.getElementById('withdraw').addEventListener('click', function() {
  showSection('withdrawSection');
});

 Function to switch between sections
 function showSection(sectionId) {
   const sections = ['transactionHistory', 'depositSection', 'withdrawSection'];
   sections.forEach(function(section) {
     document.getElementById(section).classList.add('hidden');
   });
   document.getElementById(sectionId).classList.remove('hidden');
 }
 const usersData = JSON.parse(localStorage.getItem("usersData")) || {};
 if (!usersData[loggedInUser]) {
   usersData[loggedInUser] = { balance: 0, transactions: [] };
   localStorage.setItem("usersData", JSON.stringify(usersData));
 }

 const userData = usersData[loggedInUser];