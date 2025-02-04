document.addEventListener("DOMContentLoaded", function () {
  const confirmTransfer = document.getElementById("confirm-transfer");
  const transferStatus = document.getElementById("transfer-status");

  confirmTransfer.addEventListener("click", async function () {
      const sender = document.getElementById("sender").value;
      const recipient = document.getElementById("recipient").value;
      const amount = document.getElementById("transfer-amount").value;
      const pin = document.getElementById("transfer-pin").value;

      if (!sender || !recipient || !amount || !pin) {
          transferStatus.innerText = "All fields are required!";
          transferStatus.style.color = "red";
          return;
      }

      try {
          const response = await fetch("http://your-backend-api.com/transfer", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ sender, recipient, amount, pin })
          });

          const data = await response.json();

          if (response.ok) {
              transferStatus.innerText = "Transfer Successful!";
              transferStatus.style.color = "green";
          } else {
              transferStatus.innerText = `Error: ${data.message}`;
              transferStatus.style.color = "red";
          }
      } catch (error) {
          transferStatus.innerText = "Failed to connect to the server.";
          transferStatus.style.color = "red";
      }
  });
});
