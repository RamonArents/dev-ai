import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";

//Types of serp api that we return to the user
interface IResAttributes {
  title: string;
  link: string;
  snippet: string;
  displayed_link: string;
}

//Attributes of above type are in organic_results. Therefore we use this interface
interface ISerpApiResponse {
  organic_results?: IResAttributes[];
}

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
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
        searchQuery
      )}&api_key=${apiKey}`
    );

    //Get results using our interfaces
    const data = (await response.json()) as ISerpApiResponse;

    const results = (data.organic_results || []).map((item: IResAttributes) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: item.displayed_link,
    }));

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
