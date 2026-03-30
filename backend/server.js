import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const cache = new Map();

app.get("/search", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: "Missing query" });
    }

    if (cache.has(query)) {
        return res.json(cache.get(query));
    }

    try {
        const response = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": process.env.SERPER_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: query
            })
        });

        const data = await response.json();

        // Format results for your frontend
        const results = (data.organic || []).slice(0, 10).map(item => ({
            title: item.title,
            url: item.link,
            description: item.snippet
        }));

        cache.set(query, results);

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

app.listen(3000, () => console.log("Summit backend running"));