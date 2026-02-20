import React from "react";

const SapHeader = ({ title, tcode, onRun, isLoading }) => {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #cfdbe6 0%, #a5b8ce 100%)",
        borderBottom: "1px solid #8e9cae",
        padding: "5px 10px",
        display: "flex",
        alignItems: "center",
        height: "40px",
        flexShrink: 0, // Başlık sıkışmasın
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontWeight: "bold",
          color: "#333",
          marginRight: "15px",
          fontStyle: "italic",
          userSelect: "none",
        }}
      >
        SAP <span style={{ color: "#d35400" }}>Easy Access</span>
      </div>

      {/* T-Code Kutusu */}
      <div
        style={{
          background: "white",
          border: "1px solid #888",
          padding: "2px 5px",
          width: "150px",
          fontSize: "13px",
          color: "#333",
          boxShadow: "inset 1px 1px 2px #ccc",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#666", marginRight: "2px" }}>/n</span>
        {tcode || "SE38"}
      </div>

      {/* Başlık */}
      <div
        style={{
          flexGrow: 1,
          textAlign: "center",
          fontWeight: "bold",
          color: "#444",
          fontSize: "14px",
        }}
      >
        {title}
      </div>

      {/* Çalıştır Butonu */}
      <button
        onClick={onRun}
        disabled={isLoading}
        title="Çalıştır (F8)"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        {isLoading ? "⏳" : "▶️"}
      </button>
    </div>
  );
};

export default SapHeader;
