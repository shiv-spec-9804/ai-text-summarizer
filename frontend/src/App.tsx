import React, { useEffect, useState } from "react";
import axios from "axios";
import { Summary } from "./types/summary";
import CategoryFilter from "./components/CategoryFilter";
import SummaryTable from "./components/SummaryTable";
import SummaryActions from "./components/SummaryActions";

function App() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchSummaries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/summaries");
      // Ensure a stable, predictable order in the UI (newest first)
      // Backend does not guarantee ordering, so sort here by created_at.
      const sorted = Array.isArray(res.data)
        ? res.data.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        : res.data;
      setSummaries(sorted);
    } catch (err) {
      console.error("Failed to fetch summaries:", err);
    }
  };

  const deleteSummary = async (id: number) => {
    await axios.delete(`http://localhost:5000/summaries/${id}`);
    fetchSummaries();
  };

  const resummarize = async (id: number) => {
    await axios.post(`http://localhost:5000/summaries/${id}/resummarize`);
    fetchSummaries();
  };

  const summarizeEmails = async () => {
    await axios.post("http://localhost:5000/summarize-emails");
    fetchSummaries();
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const categories = Array.from(new Set(summaries.map((s) => s.category)));

  const pageStyle: React.CSSProperties = {
    padding: "2rem",
    fontFamily: "Inter, Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial",
    color: "#111827",
    background: "#f8fafc",
    minHeight: "100vh",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "16px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const toolbarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "16px",
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>📧 Email Summarization Dashboard</h1>
        </header>

        <div style={toolbarStyle}>
          <SummaryActions onSummarizeEmails={summarizeEmails} />
          <CategoryFilter
            categories={categories}
            categoryFilter={categoryFilter}
            onFilterChange={setCategoryFilter}
          />
        </div>

        <main style={cardStyle}>
          <SummaryTable
            summaries={summaries}
            categoryFilter={categoryFilter}
            onDelete={deleteSummary}
            onResummarize={resummarize}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
