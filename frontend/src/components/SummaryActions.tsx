import React, { useState } from "react";

type Props = {
  onSummarizeEmails: () => Promise<void>;
};

const SummaryActions: React.FC<Props> = ({ onSummarizeEmails }) => {
  const [hover, setHover] = useState(false);

  const btnStyle: React.CSSProperties = {
    background: hover ? "#2563eb" : "#3b82f6",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #3b82f6",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
    marginRight: "8px",
  };

  const downloadCSV = () => {
    window.location.href = "http://localhost:5000/summaries/export";
  };

  return (
    <div style={{margin:"16px"}}>
    <button
      aria-label="Summarize mock emails"
      onClick={onSummarizeEmails}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={btnStyle}
    >
      Summarize Mock Emails
    </button>
    <button onClick={downloadCSV} style={btnStyle}>Download CSV</button>
    </div>
  );
};

export default SummaryActions;
