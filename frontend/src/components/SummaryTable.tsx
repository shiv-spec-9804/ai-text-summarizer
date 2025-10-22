import React, { useState } from "react";
import { Summary } from "../types/summary";

type Props = {
  summaries: Summary[];
  categoryFilter: string;
  onDelete: (id: number) => void;
  onResummarize: (id: number) => void;
};

const SummaryTable: React.FC<Props> = ({
  summaries,
  categoryFilter,
  onDelete,
  onResummarize,
}) => {
  const filteredSummaries = summaries.filter(
    (s) => !categoryFilter || s.category === categoryFilter
  );

  if (filteredSummaries.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          margin: "12px 0",
          borderRadius: "8px",
          background: "linear-gradient(90deg, #eef2ff, #f8fafc)",
          color: "#1f2937",
          border: "1px solid #e6edf3",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <strong style={{ display: "block", marginBottom: "6px" }}>No summaries available</strong>
          <span style={{ fontSize: "0.95rem", color: "#374151" }}>
            There are no summaries that match the selected category.
          </span>
        </div>
      </div>
    );
  }

  // Table styles
  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontFamily: "Inter, Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial",
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "10px 12px",
    background: "#111827",
    color: "white",
    fontSize: "0.95rem",
    fontWeight: 600,
  };

  const tbodyStyle: React.CSSProperties = {
    background: "white",
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Sender</th>
          <th style={thStyle}>Subject</th>
          <th style={thStyle}>Summary</th>
          <th style={thStyle}>Category</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody style={tbodyStyle}>
        {filteredSummaries.map((s, idx) => (
          <ActionRow
            key={s.id}
            summary={s}
            onDelete={onDelete}
            onResummarize={onResummarize}
            rowIndex={idx}
          />
        ))}
      </tbody>
    </table>
  );
};

type ActionRowProps = {
  summary: Summary;
  onDelete: (id: number) => void;
  onResummarize: (id: number) => void;
  rowIndex?: number;
};

const ActionRow: React.FC<ActionRowProps> = ({ summary, onDelete, onResummarize, rowIndex = 0 }) => {
  const [hovered, setHovered] = useState<null | "resummarize" | "delete">(null);
  const [rowHover, setRowHover] = useState(false);

  const btnBase: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid transparent",
    cursor: "pointer",
    fontSize: "0.9rem",
  };

  const resummarizeStyle: React.CSSProperties = {
    ...btnBase,
    background: hovered === "resummarize" ? "#2563eb" : "#3b82f6",
    color: "white",
    borderColor: hovered === "resummarize" ? "#1e40af" : "#3b82f6",
  };

  const deleteStyle: React.CSSProperties = {
    ...btnBase,
    background: hovered === "delete" ? "#dc2626" : "#ef4444",
    color: "white",
    borderColor: hovered === "delete" ? "#7f1d1d" : "#ef4444",
  };

  const rowStyle: React.CSSProperties = {
    background: rowHover ? "#f1f5f9" : rowIndex % 2 === 0 ? "#ffffff" : "#f8fafc",
    transition: "background 120ms ease",
  };

  const summaryCellStyle: React.CSSProperties = {
    maxWidth: "360px",
    padding: "10px 12px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const cellStyle: React.CSSProperties = {
    padding: "10px 12px",
    verticalAlign: "top",
  };

  return (
    <tr
      style={rowStyle}
      onMouseEnter={() => setRowHover(true)}
      onMouseLeave={() => setRowHover(false)}
    >
      <td>{summary.sender}</td>
      <td>{summary.subject}</td>
      <td style={summaryCellStyle} title={summary.summary_text}>{summary.summary_text}</td>
      <td style={cellStyle}>{summary.category}</td>
      <td style={cellStyle}>
        <button
          aria-label={`Re-summarize ${summary.subject}`}
          onClick={() => onResummarize(summary.id)}
          onMouseEnter={() => setHovered("resummarize")}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered("resummarize")}
          onBlur={() => setHovered(null)}
          style={resummarizeStyle}
        >
          Re-summarize
        </button>
        &nbsp;
        <button
          aria-label={`Delete ${summary.subject}`}
          onClick={() => onDelete(summary.id)}
          onMouseEnter={() => setHovered("delete")}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered("delete")}
          onBlur={() => setHovered(null)}
          style={deleteStyle}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default SummaryTable;
