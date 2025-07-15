import { useState } from "react";

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });


      if (!response.ok) {
        throw new Error("Failed to fetch analysis");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please check the URL or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-center">ClearLift</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 rounded border border-gray-300"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Analyze
          </button>
        </form>

        {loading && <p className="text-blue-600">Analyzing website...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {result && (
          <div className="bg-white p-6 rounded shadow space-y-2">
            <h2 className="text-xl font-bold mb-2">SEO Report</h2>
            <p><strong>Title:</strong> {result.title}</p>
            <p><strong>Description:</strong> {result.metaDescription}</p>
            <p><strong>H1 Count:</strong> {result.h1Count}</p>
            <p><strong>Total Images:</strong> {result.imgCount}</p>
            <p><strong>Images without alt:</strong> {result.imgWithoutAlt}</p>
          </div>
        )}
      </main>
    </div>
  );
}
