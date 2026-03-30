const API_URL = "https://api.summit.yourdomain/search"; // change later

async function search() {
    const query = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");

    if (!query) return;

    resultsDiv.innerHTML = "Searching...";

    try {
        const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        resultsDiv.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "result";

            div.innerHTML = `
                <a href="${item.url}" target="_blank">
                    <h3>${item.title}</h3>
                </a>
                <p>${item.description || ""}</p>
            `;

            resultsDiv.appendChild(div);
        });
    } catch (err) {
        resultsDiv.innerHTML = "Error loading results.";
    }
}

// Enter key support
document.getElementById("searchInput")
    .addEventListener("keypress", function(e) {
        if (e.key === "Enter") search();
    });