import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.body as { query?: string };

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const sites = [
      "site:w3schools.com",
      "site:developer.mozilla.org",
      "site:react.dev",
    ].join(" OR ");

    const searchQuery = `${query} ${sites}`;

    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "SERP_API_KEY not set" });
    }

    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
        searchQuery
      )}&api_key=${apiKey}`
    );

    //TODO: Replace any types
    const data:any = await response.json();

    const results = (data.organic_results || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: item.displayed_link,
    }));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
