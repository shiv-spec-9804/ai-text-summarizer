import React from "react";

type Props = {
  categories: string[];
  categoryFilter: string;
  onFilterChange: (value: string) => void;
};

const CategoryFilter: React.FC<Props> = ({ categories, categoryFilter, onFilterChange }) => {
  const containerStyle: React.CSSProperties = {
    margin: "1rem 0",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.95rem",
    color: "#374151",
    fontWeight: 500,
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    fontSize: "0.95rem",
    color: "#111827",
    minWidth: "160px",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
  };

  const selectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    (e.target as HTMLSelectElement).style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
    (e.target as HTMLSelectElement).style.borderColor = "#3b82f6";
  };

  const selectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    (e.target as HTMLSelectElement).style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
    (e.target as HTMLSelectElement).style.borderColor = "#d1d5db";
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle} htmlFor="category-filter">
        Filter by category:
      </label>
      <select
        id="category-filter"
        aria-label="Filter summaries by category"
        value={categoryFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        onFocus={selectFocus}
        onBlur={selectBlur}
        style={selectStyle}
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
