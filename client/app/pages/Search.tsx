import { useState, type JSX } from "react";

//Type of search result
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
}

export function Search():JSX.Element {
  //Query and answer states
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<SearchResult[]>([]);

  /**
   * Handle search results
   * @param e React.FormEvent<HTMLFormElement>
   */
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Await response from api
    const res = await fetch("http://localhost:3001/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    //Check response and catch error
    try {
      const data = await res.json();
      setAnswer(data.results);
    } catch (error) {
      console.error("Something went wrong");
    }

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-500">Welcome to dev-ai</h1>
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 bg-white p-4 rounded-2xl shadow-md"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="px-4 py-2 w-64 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
      <div className="max-w-xl space-y-4">
        {answer?.map((item, index) => 
        (
       
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow-sm border"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline"
            >
              {item.title}
            </a>
            <p className="text-gray-600 mt-2">{item.snippet}</p>
            <p className="text-sm text-gray-400 mt-1">{item.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
