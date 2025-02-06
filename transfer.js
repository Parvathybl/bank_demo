document.addEventListener("DOMContentLoaded", function () {
    const confirmTransfer = document.getElementById("confirm-transfer");
    const transferStatus = document.getElementById("transfer-status");

    function showStatus(message, isError = false) {
        transferStatus.innerText = message;
        transferStatus.style.color = isError ? "red" : "green";
    }

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem("users")) || {};
        } catch (error) {
            console.error("Corrupted user data in localStorage", error);
            return {};
        }
    }

    function validateAccountExists(accountNumber) {
        const users = getUsers();
        for (const key in users) {
            if (users[key].accountNumber === accountNumber) {
                return { key, user: users[key] };
            }
        }
        return null;
    }

    confirmTransfer.addEventListener("click", async function () {
        const sender = document.getElementById("sender").value.trim();
        const recipient = document.getElementById("recipient").value.trim();
        const amount = document.getElementById("transfer-amount").value.trim();

        if (!sender || !recipient || !amount) {
            showStatus("All fields are required!", true);
            return;
        }

        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
            showStatus("Invalid transfer amount!", true);
            return;
        }

        try {
            let users = getUsers();
            console.log("Users before transfer:", users);

            // Validate sender and recipient accounts
            const senderData = validateAccountExists(sender);
            const recipientData = validateAccountExists(recipient);

            if (!senderData) {
                showStatus("Sender account does not exist!", true);
                return;
            }
            if (!recipientData) {
                showStatus("Recipient account does not exist!", true);
                return;
            }

            const { key: senderKey, user: senderAccount } = senderData;
            const { key: recipientKey, user: recipientAccount } = recipientData;

            // Prevent self-transfer
            if (sender === recipient) {
                showStatus("Cannot transfer to the same account!", true);
                return;
            }

            // Check sufficient balance
            if (senderAccount.balance < numAmount) {
                showStatus("Insufficient balance!", true);
                return;
            }

            // Disable button to prevent double-click
            confirmTransfer.disabled = true;

            // Update balances
            users[senderKey].balance = (senderAccount.balance - numAmount).toFixed(2);
            users[recipientKey].balance = (recipientAccount.balance + numAmount).toFixed(2);

            // Log transactions
            users[senderKey].transactions.push({
                type: "Sent",
                amount: numAmount,
                date: new Date().toISOString(),
                to: recipientAccount.name || recipient
            });

            users[recipientKey].transactions.push({
                type: "Received",
                amount: numAmount,
                date: new Date().toISOString(),
                from: senderAccount.name || sender
            });

            // Save updated user data
            localStorage.setItem("users", JSON.stringify(users));

            // Show success and reset form
            showStatus("Transfer Successful!");
            document.getElementById("sender").value = "";
            document.getElementById("recipient").value = "";
            document.getElementById("transfer-amount").value = "";

            console.log("Users after transfer:", users);

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);

        } catch (error) {
            showStatus("Failed to process transfer. Please try again.", true);
            console.error("Transfer error:", error);
        } finally {
            confirmTransfer.disabled = false;
        }
    });

    // Debugging info
    console.log("Available accounts in transfer:", localStorage.getItem("users"));
});
