import React, { useState } from "react";

const LessonSidebar = ({
  curriculum,
  activeLessonId,
  onSelectLesson,
  isOpen,
  toggleSidebar,
}) => {
  // Hangi ünitelerin açık olduğunu tutan state
  const [expandedUnit, setExpandedUnit] = useState("unit-1");

  const toggleUnit = (unitId) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  return (
    <div
      style={{
        width: isOpen ? "280px" : "50px", // Kapalıyken ince bir şerit kalsın veya 0 olsun
        background: "#f0f2f5",
        borderRight: "1px solid #d1d5db",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.3s ease",
        overflow: "hidden", // İçerik taşmasın
        boxShadow: isOpen ? "2px 0 5px rgba(0,0,0,0.05)" : "none",
        position: "relative",
      }}
    >
      {/* --- SIDEBAR HEADER & TOGGLE --- */}
      <div
        style={{
          padding: "15px",
          background: "#2c3e50",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          height: "50px",
          boxSizing: "border-box",
        }}
      >
        {isOpen && (
          <span
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              whiteSpace: "nowrap",
            }}
          >
            🎓 Akademi
          </span>
        )}

        {/* Hamburger Button */}
        <button
          onClick={toggleSidebar}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={isOpen ? "Menüyü Kapat" : "Menüyü Aç"}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* --- MÜFREDAT LİSTESİ --- */}
      <div
        style={{
          overflowY: "auto",
          flexGrow: 1,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {curriculum.map((unit) => (
          <div key={unit.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
            {/* Ünite Başlığı */}
            <div
              onClick={() => toggleUnit(unit.id)}
              style={{
                padding: "12px 15px",
                cursor: "pointer",
                background: "#e2e8f0",
                color: "#1e293b",
                fontWeight: "600",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                userSelect: "none",
              }}
            >
              <span>{unit.title}</span>
              <span style={{ fontSize: "10px", color: "#64748b" }}>
                {expandedUnit === unit.id ? "▼" : "▶"}
              </span>
            </div>

            {/* Dersler */}
            <div
              style={{
                maxHeight: expandedUnit === unit.id ? "500px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease-in-out",
                background: "white",
              }}
            >
              {unit.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson)}
                  style={{
                    padding: "10px 15px 10px 25px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: activeLessonId === lesson.id ? "#0078d4" : "#475569",
                    background:
                      activeLessonId === lesson.id ? "#eff6fc" : "transparent",
                    borderLeft:
                      activeLessonId === lesson.id
                        ? "3px solid #0078d4"
                        : "3px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (activeLessonId !== lesson.id)
                      e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (activeLessonId !== lesson.id)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ marginRight: "8px", fontSize: "14px" }}>
                    📄
                  </span>
                  {lesson.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Kapalı Modda İkon Gösterimi (Opsiyonel) */}
      {!isOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <span
            style={{ fontSize: "20px", cursor: "pointer", padding: "10px" }}
            onClick={toggleSidebar}
          >
            📚
          </span>
        </div>
      )}

      {/* --- YASAL UYARI (DISCLAIMER) --- */}
      {isOpen && (
        <div
          style={{
            fontSize: "10px",
            color: "#888",
            padding: "15px",
            borderTop: "1px solid #ddd",
            marginTop: "auto", // Flex yapısında bu yazıyı en dibe iter
            textAlign: "left",
            lineHeight: "1.4",
            backgroundColor: "#f8fafc", // Çok hafif bir gri arkaplan
          }}
        >
          Bu platform, açık kaynaklı <b>abaplint</b> altyapısı kullanılarak
          eğitim amaçlı geliştirilmiştir. SAP SE ile hiçbir resmi bağı yoktur.
          SAP ve ABAP, SAP SE'nin tescilli ticari markalarıdır.
        </div>
      )}
    </div>
  );
};

export default LessonSidebar;
