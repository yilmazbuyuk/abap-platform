import React from "react";

const SapStatusBar = ({ status, activeLessonId }) => {
  // Duruma göre ikon ve renk belirle
  const getStatusStyle = () => {
    switch (status.type) {
      case "error":
        return { icon: "🔴", color: "#cc0000", weight: "bold" };
      case "loading":
        return { icon: "🟡", color: "#333", weight: "normal" };
      case "success":
        return { icon: "🟢", color: "#333", weight: "normal" };
      default:
        return { icon: "⚪", color: "#333", weight: "normal" };
    }
  };

  const style = getStatusStyle();

  return (
    <div
      style={{
        height: "25px",
        background: "#dfe6eb",
        borderTop: "1px solid #999",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        fontSize: "12px",
        fontFamily: "Tahoma, sans-serif",
        flexShrink: 0,
      }}
    >
      {/* İkon */}
      <span style={{ marginRight: "10px" }}>{style.icon}</span>

      {/* Mesaj */}
      <span style={{ color: style.color, fontWeight: style.weight }}>
        {status.text}
      </span>

      {/* Sağ Taraf Bilgileri */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: "15px",
          color: "#666",
        }}
      >
        <span>INS</span>
        <span>TRM: k8s-pod-1</span>
        <span>{activeLessonId}</span>
      </div>
    </div>
  );
};

export default SapStatusBar;
