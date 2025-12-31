import { useState } from "react";

export function Welcome() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");


  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    try {
      const results = await res.json();
      setAnswer(results);
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
      <p>{answer}</p>
    </div>
  );
}
