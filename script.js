document.addEventListener("DOMContentLoaded", function () {

  if (document.querySelector(".slideshow")) {
    let slideIndex = 0;
    showSlides();

    // Add click handlers for prev/next buttons
    document.querySelector(".prev").addEventListener("click", () => changeSlide(-1));
    document.querySelector(".next").addEventListener("click", () => changeSlide(1));

    function changeSlide(n) {
      slideIndex += n;
      showSlides();
    }

    function showSlides() {
      const slides = document.getElementsByClassName("slides");
      
      // Reset slideIndex if it goes out of bounds
      if (slideIndex >= slides.length) slideIndex = 0;
      if (slideIndex < 0) slideIndex = slides.length - 1;
      
      // Hide all slides
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      
      // Show the current slide
      slides[slideIndex].style.display = "block";
    }

    // Automatic slideshow
    setInterval(() => {
      slideIndex++;
      showSlides();
    }, 3000);
  }
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
    const fathernameElement = document.getElementById("father_name");
    const phoneElement = document.getElementById("phone");
    const mailElement = document.getElementById("email");
    const genderElement = document.getElementById("gender");
    const addressElement = document.getElementById("address");
    const accounttype = document.getElementById("account_type");
   
    // Initialize dashboard
    loadDashboard();


    // Transaction handler
    if (makeTransactionButton) {
      makeTransactionButton.addEventListener("click", async function () {
        const transactionAmount = parseFloat(amountInput.value);
        const selectedType = transactionType.value;

        if (!transactionAmount || transactionAmount <= 0) {
          alert("Please enter a valid amount.");
          return;
        }

        const currentUser = sessionStorage.getItem("currentUser");

        const response=await fetch(`https://backend-bank-kb1l.onrender.com/api/transaction/${selectedType}`, {
          method: `POST`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: currentUser,
            amount: transactionAmount,
          })
        });

        const data=await response.json();
        
        if(response.ok) {
          loadDashboard();
        } else {
          alert(data.message || "Transaction failed");
        }

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
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      console.log("Login attempted for username:", username);

      try{
      const response=await fetch('https://backend-bank-kb1l.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

    
      const data = await response.json();
      

    
      if (response.ok) {
        sessionStorage.setItem("currentUser", username);
        console.log("Login successful, redirecting to dashboard");
        window.location.href = 'dashboard.html';
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("unable to connect to the server. Please make sure the server is running.");
    }
    });
  }

  // Register form handler
  const registerForm = document.querySelector("#register-form");
    if (registerForm) {
        console.log("Register form found");
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById("username");
            const mailinput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput = document.getElementById("confirm-password");
            
            if (!usernameInput ||!mailinput || !passwordInput || !confirmPasswordInput) {
                console.error("Required form elements not found");
                return;
            }

            const username = usernameInput.value;
            const email = mailinput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validation
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
              const response = await fetch("https://backend-bank-kb1l.onrender.com/api/register",{
                method: "POST",
                headers: {
                  "Content-Type":"application/json"
                },
                body: JSON.stringify({username,email,password, confirmPassword})
              });

              const data = await response.json();
              console.log("Server Response:", data);

              if(response.ok) {
                alert("Registration successful!");
                // After successful registration:
                sessionStorage.setItem("pendingUsername", username.trim());
                sessionStorage.setItem("pendingPassword", password);

                window.location.href="user-details.html";
              } else {
                alert(data.message || "Registration failed!");
              }
            } catch (error) {
              console.error("Error:", error);
              alert("An error occured while registering. Please try again.");
            }
          });
        } 

//User Details         
// User Details Form
const userDetailsForm = document.querySelector("#user-details-form");
if (userDetailsForm) {
  console.log("User details form found");

  // Retrieve values from session storage
  const pendingUsername = sessionStorage.getItem("pendingUsername");
  const pendingPassword = sessionStorage.getItem("pendingPassword");

  // Check if pendingUsername exists before adding the event listener
  if (!pendingUsername) {
    console.error("No pendingUsername found in sessionStorage!");
    alert("Error: Username not found. Please register again.");
    // Optionally, redirect the user:
    // window.location.href = 'registration.html';
    // Stop execution if username is missing:
    throw new Error("pendingUsername is missing");
  }

  // Add the event listener once we know pendingUsername is valid
  userDetailsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const dobInput = document.getElementById("dob");
    const fatherNameInput = document.getElementById("father_name");
    const phoneInput = document.getElementById("phone");
    const mailInput = document.getElementById("email");
    const genderInput = document.getElementById("gender");
    const addressInput = document.getElementById("address");
    const accounttypeInput = document.getElementById("account_type");

    if (!nameInput || !dobInput || !genderInput || !addressInput || !fatherNameInput || !phoneInput || !mailInput || !accounttypeInput) {
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
      father_name: fatherNameInput.value,
      phone: phoneInput.value,
      email: mailInput.value,
      gender: genderInput.value,
      address: addressInput.value,
      account_type: accounttypeInput.value,
      balance: 0,
      transactions: []
    };

    try {
      // Use pendingUsername safely now that we checked it exists.
      const response = await fetch(`https://backend-bank-kb1l.onrender.com/api/user-details/${pendingUsername.trim()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.removeItem("pendingUsername");
        sessionStorage.removeItem("pendingPassword");

        alert("Registration complete! Please login.");
        window.location.href = 'login.html';
      } else {
        alert(data.message || "Error saving user details!");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("An error occurred while saving user details. Please try again.");
    }
  });
}



    const toggleBtn=document.getElementById("toggle-btn");
    if(toggleBtn) {
      toggleBtn.onclick=function() {
        const transactionList = document.getElementById("transaction-list");
        transactionList.style.display=transactionList.style.display ==="none" ? "block" : "none";
      }
    }
      
  


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

async function loadDashboard() {
  const currentUser = sessionStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  try{
    const response=await fetch(`https://backend-bank-kb1l.onrender.com/api/user/${currentUser}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    const userData = await response.json();
  if (response.ok) {

  // Display user data
  const elements = {
    "user-display": currentUser,
    "accountNumber": userData.accountNumber,
    "branchName": userData.branchName,
    "current-balance": userData.balance,
    "name": userData.name,
    "dob": userData.dob,
    "father_name":userData.father_name,
    "gender": userData.gender,
    "address": userData.address,
    "phone": userData.phone,
    "email": userData.email,
    "account_type":userData.account_type
  };

  for (const [id, value] of Object.entries(elements)) {
    const element = document.getElementById(id);
    if (element && value) element.textContent = value;
  }

  // Update transaction history
  updateTransactionHistory(userData.transactions);
}else {
  alert(userData.message || "Failed to load dashboard data");
  window.location.href='login.html';
}
} catch (error) {
  console.error("Error loading dashboard:", error);
  window.location.href ='login.html';
}
}

// Default user data structure
const defaultUserData = {
  accountNumber: "",
  branchName: "",
  balance: 0,
  transactions: [],
  name: "",
  dob: "",
  father_name: "",
  phone:"",
  email:"",
  gender: "",
  address: "",
  account_type:"",
};



function animateCounter(id, start, end, duration) {
  const element = document.getElementById(id);

  if (!element) {
    console.warn(`Element with id '${id}' not found for counter animation`);
    return;
  }
  let current = start;
  const increment = (end - start) / (duration / 10);

  const interval = setInterval(() => {
    current += increment;
    if (current >= end) {
      clearInterval(interval);
      current = end;
    }
    try {
      element.textContent = Math.floor(current).toLocaleString();
    } catch (error) {
      console.warn(`Error updating counter for '${id}':`, error);
      clearInterval(interval);
    }
  }, 10);
}
animateCounter("customers", 0, 501254133, 5000);
animateCounter("atms", 0, 63580, 5000);
animateCounter("branches", 0, 22500, 5000);
animateCounter("cdm", 0, 6500, 5000);
});
