const API_URL = "https://dl2ohkgzrcrcgchbv6o3373f3m0bqpgx.lambda-url.us-east-1.on.aws/";

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

loadStats();