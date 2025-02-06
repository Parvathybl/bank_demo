document.addEventListener("DOMContentLoaded", function () {
    const confirmTransfer = document.getElementById("confirm-transfer");
    const transferStatus = document.getElementById("transfer-status");

    function showStatus(message, isError = false) {
        transferStatus.innerText = message;
        transferStatus.style.color = isError ? "red" : "green";
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
        if (isNaN(numAmount) || numAmount <= 0) {
            showStatus("Invalid transfer amount!", true);
            return;
        }

        try {
            confirmTransfer.disabled = true; // Prevent multiple clicks

            const response = await fetch("https://backend-bank-kb1l.onrender.com/api/transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sender, recipient, amount: numAmount })
            });

            const result = await response.json();

            if (result.success) {
                showStatus(result.message);
                setTimeout(() => {
                    window.location.href = "dashboard.html"; // Redirect after success
                }, 2000);
            } else {
                showStatus(result.message, true);
            }
        } catch (error) {
            showStatus("Server error! Please try again later.", true);
            console.error("Transfer error:", error);
        } finally {
            confirmTransfer.disabled = false;
        }
    });
});
