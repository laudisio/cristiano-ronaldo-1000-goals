const API_URL = "https://dl2ohkgzrcrcgchbv6o3373f3m0bqpgx.lambda-url.us-east-1.on.aws/";
const DONATION_API_URL = "https://7qijfr3uhqinaxypfnwvgksxea0znzct.lambda-url.us-east-1.on.aws/";
const EMAIL_API_URL = "https://77uecx24bski46o3et5b3fsqku0bgfoe.lambda-url.us-east-1.on.aws/";
const flipCard = document.getElementById("flipCard");
const joinButton = document.getElementById("joinButton");
const backButton = document.getElementById("backButton");

joinButton.addEventListener("click", () => {
  flipCard.classList.add("flipped");
});

backButton.addEventListener("click", () => {
  flipCard.classList.remove("flipped");
});

const donatedButton = document.getElementById("donatedButton");
donatedButton.addEventListener("click", () => {
    setupEmailPopup();
}, 2500);

function setupEmailPopup() {
  const popup = document.getElementById("emailPopup");
  const closeButton = document.getElementById("closeEmailPopup");
  const subscribeButton = document.getElementById("subscribeButton");
  const emailInput = document.getElementById("emailInput");
  const message = document.getElementById("emailPopupMessage");

  const hasSeenPopup = localStorage.getItem("hasSeenEmailPopup") === "true";

  if (!hasSeenPopup) {
    setTimeout(() => {
      popup.classList.add("show");
    }, 2500);
  }

  closeButton.addEventListener("click", () => {
    popup.classList.remove("show");
    localStorage.setItem("hasSeenEmailPopup", "true");
  });

  subscribeButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    if (!email) {
      message.textContent = "Please enter your email.";
      return;
    }

    subscribeButton.disabled = true;
    subscribeButton.textContent = "Subscribing...";

    try {
      const response = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      message.textContent = data.message || "Subscribed successfully!";
      localStorage.setItem("hasSeenEmailPopup", "true");

      setTimeout(() => {
        popup.classList.remove("show");
      }, 1500);

    } catch (error) {
      console.error(error);
      message.textContent = "Error subscribing. Please try again.";
      subscribeButton.disabled = false;
      subscribeButton.textContent = "Subscribe";
    }
  });
}

async function loadStats() {
    try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const totalGoals = Number(data.totalGoals || 0);
    const targetGoals = Number(data.targetGoals || 1000);
    const remainingGoals = Math.max(targetGoals - totalGoals, 0);
    const progress = Math.min((totalGoals / targetGoals) * 100, 100);

    document.getElementById("goalsNumber").textContent = totalGoals;
    document.getElementById("remainingGoals").textContent =
        `${remainingGoals} remaining`;

    document.getElementById("progressFill").style.width =
        `${progress}%`;

    if (data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        document.getElementById("lastUpdated").textContent =
        `Last update: ${date.toLocaleString()}`;
    } else {
        document.getElementById("lastUpdated").textContent =
        "Data loaded successfully";
    }

    } catch (error) {
    console.error(error);
    document.getElementById("lastUpdated").textContent =
        "Error loading data";
    }
}
async function loadDonationCounter() {
  const donationCount = document.getElementById("donationCount");

  try {
    const response = await fetch(DONATION_API_URL, {
      method: "GET"
    });

    const data = await response.json();

    donationCount.textContent = data.treesClaimed || data.supporters || 0;
  } catch (error) {
    console.error("Error loading donation counter:", error);
    donationCount.textContent = "0";
  }
}

function setupDonationButton() {
  const donatedButton = document.getElementById("donatedButton");
  const donationCount = document.getElementById("donationCount");

  const lastDonationDate = localStorage.getItem("lastDonationDate");
  const today = new Date().toDateString();

  const alreadyDonatedToday = lastDonationDate === today;

  if (alreadyDonatedToday) {
    donatedButton.textContent = "Thanks for your support 💛\n\nYou can do it again tomorrow";
    donatedButton.disabled = true;
  }

  donatedButton.addEventListener("click", async () => {
    if (localStorage.getItem("alreadyDonated") === "true") return;

    donatedButton.disabled = true;
    donatedButton.textContent = "Registering...";

    try {
      const response = await fetch(DONATION_API_URL, {
        method: "POST"
      });

      const data = await response.json();

      donationCount.textContent = data.treesClaimed || data.supporters || 0;
        
      localStorage.setItem("lastDonationDate", today);
      donatedButton.textContent = "Thanks for your support 💛\n\nYou can do it again tomorrow";

    } catch (error) {
      console.error("Error registering donation:", error);
      donatedButton.disabled = false;
      donatedButton.textContent = "I Already Donated";
    }
  });
}

loadStats();
loadDonationCounter();
setupDonationButton();