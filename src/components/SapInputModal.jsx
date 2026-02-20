import React, { useState, useEffect } from "react";

const SapInputModal = ({ parameters, onClose, onSubmit }) => {
  const [formValues, setFormValues] = useState({});

  // 1. Başlangıç Değerlerini Ata
  useEffect(() => {
    const initialValues = {};
    if (parameters) {
      parameters.forEach((param) => {
        // Radyo butonlarında ilkini varsayılan seçebiliriz ama şimdilik boş bırakalım
        // Checkbox ve Radio ABAP'ta 'X' veya ' ' (boşluk) alır.
        initialValues[param.name] = "";
      });
    }
    setFormValues(initialValues);
  }, [parameters]);

  // 2. Değişiklik Yönetimi (Radio ve Checkbox için özel mantık)
  const handleChange = (param, e) => {
    const value = e.target.value;
    const type = param.type;

    if (type === "checkbox") {
      // Checkbox mantığı: İşaretliyse 'X', değilse ''
      setFormValues((prev) => ({
        ...prev,
        [param.name]: e.target.checked ? "X" : "",
      }));
    } else if (type === "radio") {
      // Radio Mantığı: Gruptaki diğerlerini temizle, bunu 'X' yap
      const newValues = { ...formValues };

      // Bu grubun diğer üyelerini bul ve temizle
      parameters.forEach((p) => {
        if (p.group === param.group) {
          newValues[p.name] = "";
        }
      });

      // Seçileni 'X' yap
      newValues[param.name] = "X";
      setFormValues(newValues);
    } else {
      // Normal Text/Date/Number
      setFormValues((prev) => ({
        ...prev,
        [param.name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  // --- INPUT RENDERER (Tipe göre şekil değiştir) ---
  const renderInput = (param) => {
    const val = formValues[param.name] || "";

    switch (param.type) {
      case "date":
        return (
          <input
            type="date"
            value={val}
            onChange={(e) => handleChange(param, e)}
            style={{
              flexGrow: 1,
              padding: "4px",
              border: "1px solid #bfbfbf",
              fontFamily: "inherit",
            }}
          />
        );

      case "checkbox":
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={val === "X"}
              onChange={(e) => handleChange(param, e)}
              style={{ transform: "scale(1.2)", cursor: "pointer" }}
            />
            <span
              style={{ marginLeft: "8px", fontSize: "11px", color: "#666" }}
            >
              (Seçmek için tıklayın)
            </span>
          </div>
        );

      case "radio":
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name={param.group} // Aynı name olmalı ki HTML de anlasın
              checked={val === "X"}
              onChange={(e) => handleChange(param, e)}
              style={{ transform: "scale(1.2)", cursor: "pointer" }}
            />
            <span
              style={{ marginLeft: "8px", fontSize: "11px", color: "#666" }}
            >
              {param.name.toUpperCase()} Seçeneği
            </span>
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={val}
            onChange={(e) => handleChange(param, e)}
            style={{ flexGrow: 1, padding: "4px", border: "1px solid #bfbfbf" }}
          />
        );

      default: // Text
        return (
          <input
            type="text"
            value={val}
            onChange={(e) => handleChange(param, e)}
            autoComplete="off"
            style={{ flexGrow: 1, padding: "4px", border: "1px solid #bfbfbf" }}
          />
        );
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#f0f0f0",
          width: "500px",
          border: "1px solid #999",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          fontFamily: "Tahoma, sans-serif",
          fontSize: "12px",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(to right, #2b4e81, #5d87bf)",
            color: "white",
            padding: "8px 10px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Program Seçim Ekranı</span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "20px",
            borderTop: "2px solid #e0ab26",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {!parameters || parameters.length === 0 ? (
            <p>Giriş parametresi bulunamadı.</p>
          ) : (
            parameters.map((param) => (
              <div
                key={param.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                {/* Label Kısmı */}
                <label
                  style={{
                    width: "150px",
                    color: "#333",
                    fontWeight: "bold",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  title={param.name}
                >
                  {/* Radio buttonlarda label gereksiz olabilir ama tutarlılık için kalsın */}
                  {param.type === "radio" ? "" : param.name.toUpperCase()}
                  {param.type === "radio" && (
                    <span style={{ color: "#888", fontWeight: "normal" }}>
                      Seçenek:
                    </span>
                  )}
                </label>

                {/* Input Kısmı */}
                <div style={{ flexGrow: 1 }}>{renderInput(param)}</div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "10px",
            background: "#dcdcdc",
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #bbb",
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              background: "#f0f0f0",
              border: "1px solid #888",
              padding: "5px 15px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#333",
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <span style={{ marginRight: "5px" }}>🕒</span> Yürüt (F8)
          </button>
          <button
            onClick={onClose}
            style={{
              background: "#f0f0f0",
              border: "1px solid #888",
              padding: "5px 15px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SapInputModal;
