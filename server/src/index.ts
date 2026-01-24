import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";
import { IAiAttributes, IRefAttributes, ISerpApiResponse } from "./types";

//Express default settings
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

//Search request
app.post("/api/search", async (req: Request, res: Response) => {
  try {
    //Get query from reqeust body. Return 400 if no query is given
    const { query } = req.body as { query?: string };

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    //Sites we search. This can be extended.
    const sites = [
      "site:w3schools.com",
      "site:developer.mozilla.org",
      "site:react.dev",
    ].join(" OR ");

    const searchQuery = `${query} ${sites}`;

    //Check if apiKey is set. If not return 500
    const apiKey = process.env.SERP_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "SERP_API_KEY not set" });
    }

    //Await response using searchQuery as parameter
    const response = await fetch(
      `https://serpapi.com/search?engine=google_ai_mode&q=${encodeURIComponent(
        searchQuery
      )}&api_key=${apiKey}`
    );

    //Get results using our interfaces
    const data = (await response.json()) as ISerpApiResponse;

    const text_blocks = (data.text_blocks || []).map((item: IAiAttributes) => ({
      snippet: item.type === "paragraph" && item.snippet,
    }));

    const references = (data.references || []).map((item: IRefAttributes) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }))

    const results = [...text_blocks, ...references];

    res.json({ results });
  } catch (err) {
    //Show error message
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Check if server is running
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
