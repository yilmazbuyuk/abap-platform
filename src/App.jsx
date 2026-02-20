import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { curriculum } from "./data";
import SapHeader from "./components/SapHeader";
import LessonSidebar from "./components/LessonSidebar";
import SapStatusBar from "./components/SapStatusBar";
import SapGrid from "./components/SapGrid";
import SapInputModal from "./components/SapInputModal"; // <--- YENİ

function App() {
  const [activeLesson, setActiveLesson] = useState(curriculum[0].lessons[0]);
  const [code, setCode] = useState(activeLesson.code);
  const [output, setOutput] = useState("Çıktı bekleniyor...");
  const [alvData, setAlvData] = useState(null);
  const [activeTab, setActiveTab] = useState("spool");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- YENİ STATE'LER ---
  const [showInputModal, setShowInputModal] = useState(false);
  const [detectedParams, setDetectedParams] = useState([]);
  const [statusMessage, setStatusMessage] = useState({
    type: "success",
    text: "Sistem Hazır.",
  });

  const handleLessonChange = (lesson) => {
    setActiveLesson(lesson);
    setCode(lesson.code);
    setOutput("");
    setAlvData(null);
    setActiveTab("spool");
    setStatusMessage({
      type: "success",
      text: `Ders yüklendi: ${lesson.title}`,
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // --- 1. PARAMETRE TARAMA FONKSİYONU ---
  // --- GÜÇLENDİRİLMİŞ PARAMETRE TARAYICI ---
  // --- 1. GELİŞMİŞ PARAMETRE TARAYICI (Scanner) ---
  const scanForParameters = (sourceCode) => {
    const params = [];

    // Yorum satırlarını temizle
    const cleanCode = sourceCode
      .split("\n")
      .filter(
        (line) => !line.trim().startsWith("*") && !line.trim().startsWith('"'),
      )
      .join("\n");

    // Komut bloklarını bul (PARAMETERS .... .)
    const paramBlockRegex = /PARAMETERS:?([\s\S]+?)\./gi;

    let blockMatch;
    while ((blockMatch = paramBlockRegex.exec(cleanCode)) !== null) {
      const content = blockMatch[1];
      const lines = content.split(/,|\n/);

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const parts = trimmed.split(/\s+/);
        const paramName = parts[0]; // Değişken adı (p_ad)

        // Yasaklı kelime kontrolü
        const ignoredKeywords = [
          "TYPE",
          "LIKE",
          "DEFAULT",
          "LOWER",
          "OBLIGATORY",
          "VISIBLE",
          "AS",
          "RADIOBUTTON",
        ];

        if (
          paramName &&
          !ignoredKeywords.includes(paramName.toUpperCase()) &&
          /^[a-zA-Z0-9_]+$/.test(paramName)
        ) {
          if (!params.find((p) => p.name === paramName)) {
            // --- TİP TESPİTİ ---
            let type = "text";
            let group = null;
            const upperLine = trimmed.toUpperCase();

            if (upperLine.includes("RADIOBUTTON GROUP")) {
              type = "radio";
              // Grup adını bul (RADIOBUTTON GROUP grp1)
              const grpMatch = /GROUP\s+(\w+)/i.exec(trimmed);
              if (grpMatch) group = grpMatch[1];
            } else if (upperLine.includes("AS CHECKBOX")) {
              type = "checkbox";
            } else if (upperLine.includes("TYPE D")) {
              // TYPE d = Date
              type = "date";
            } else if (
              upperLine.includes("TYPE I") ||
              upperLine.includes("TYPE P")
            ) {
              type = "number";
            }

            params.push({ name: paramName, type: type, group: group });
          }
        }
      });
    }
    return params;
  };

  // --- 2. ÇALIŞTIR BUTONU ---
  const handleRunClick = () => {
    // Önce kodda PARAMETERS var mı diye bak
    const params = scanForParameters(code);

    if (params.length > 0) {
      // Varsa Pop-up aç
      setDetectedParams(params);
      setShowInputModal(true);
    } else {
      // Yoksa direkt çalıştır
      executeCode(code);
    }
  };

  // --- 3. POP-UP'TAN SONRA ÇALIŞTIRMA ---
  // --- 2. VERİ GÖNDERME (Submit Handler) ---
  // --- 2. VERİ GÖNDERME (Submit Handler) ---
  const handleModalSubmit = (userValues) => {
    setShowInputModal(false);
    let injectedCode = code;
    let injections = "\n* --- USER INPUT INJECTION ---\n";

    for (const [key, value] of Object.entries(userValues)) {
      let finalValue = value;

      // 1. Bu parametrenin tipini bulalım (Date mi, Number mı?)
      const paramDef = detectedParams.find((p) => p.name === key);
      const isDateType = paramDef && paramDef.type === "date";

      // 2. TARİH DÜZELTME: 2023-10-25 -> 20231025
      if (
        typeof finalValue === "string" &&
        finalValue.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        finalValue = finalValue.replace(/-/g, "");
      }

      // 3. SAYI KONTROLÜ
      // Sayıysa tırnaksız gönderilir. AMA Tarih ise kesinlikle tırnaklı olmalı.
      const isNumber = !isNaN(finalValue) && finalValue !== "" && !isDateType;

      if (isNumber) {
        // Tam sayı (Integer) -> Tırnaksız (Örn: p_yas = 25.)
        injections += `${key} = ${finalValue}.\n`;
      } else {
        // Metin veya Tarih -> Tırnaklı (Örn: p_giris = '20240101'.)
        injections += `${key} = '${finalValue}'.\n`;
      }
    }

    if (injectedCode.includes("START-OF-SELECTION.")) {
      injectedCode = injectedCode.replace(
        "START-OF-SELECTION.",
        "START-OF-SELECTION.\n" + injections,
      );
    } else {
      injections = "START-OF-SELECTION.\n" + injections;
      injectedCode = injectedCode + "\n" + injections;
    }
    executeCode(injectedCode);
  };
  // --- 4. BACKEND İLE İLETİŞİM ---
  const executeCode = async (codeToRun) => {
    setIsLoading(true);
    setStatusMessage({ type: "loading", text: "İşleniyor..." });
    setOutput("");
    setAlvData(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToRun }),
      });

      const data = await response.json();

      if (
        data.output &&
        (data.output.includes("parser_error") ||
          data.output.includes("RUNTIME_ERROR"))
      ) {
        setStatusMessage({ type: "error", text: "Hata oluştu." });
        setOutput(data.output);
        setActiveTab("spool");
      } else {
        setStatusMessage({ type: "success", text: "Tamamlandı." });
        setOutput(data.output);

        if (data.alv && data.alv.length > 0) {
          setAlvData(data.alv);
          setActiveTab("alv");
        } else {
          setActiveTab("spool");
        }
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: "Sunucu hatası." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* POP-UP MODAL */}
      {showInputModal && (
        <SapInputModal
          parameters={detectedParams}
          onClose={() => setShowInputModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      <SapHeader
        title={activeLesson.title}
        tcode={activeLesson.tcode}
        onRun={handleRunClick} // Artık yeni fonksiyonu çağırıyor
        isLoading={isLoading}
      />

      <div
        style={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <LessonSidebar
          curriculum={curriculum}
          activeLessonId={activeLesson.id}
          onSelectLesson={handleLessonChange}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div style={{ height: "60%", borderBottom: "1px solid #ccc" }}>
            <Editor
              height="100%"
              defaultLanguage="abap"
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                padding: { top: 10 },
              }}
            />
          </div>

          <div
            style={{
              height: "40%",
              background: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                background: "#f1f3f4",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div
                onClick={() => setActiveTab("spool")}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  borderBottom:
                    activeTab === "spool"
                      ? "3px solid #0078d4"
                      : "3px solid transparent",
                  color: activeTab === "spool" ? "#0078d4" : "#5f6368",
                  background: activeTab === "spool" ? "white" : "transparent",
                }}
              >
                🖨️ Spool (Konsol)
              </div>
              <div
                onClick={() => setActiveTab("alv")}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  borderBottom:
                    activeTab === "alv"
                      ? "3px solid #0078d4"
                      : "3px solid transparent",
                  color: activeTab === "alv" ? "#0078d4" : "#5f6368",
                  background: activeTab === "alv" ? "white" : "transparent",
                }}
              >
                📊 ALV Grid (Tablo)
              </div>
            </div>

            <div
              style={{ flexGrow: 1, overflow: "hidden", position: "relative" }}
            >
              {activeTab === "spool" && (
                <div
                  style={{
                    height: "100%",
                    overflowY: "auto",
                    padding: "15px",
                    boxSizing: "border-box",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: "'Consolas', 'Courier New', monospace",
                      fontSize: "14px",
                      color: "#333",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {output || "Çıktı bekleniyor..."}
                  </pre>
                </div>
              )}

              {activeTab === "alv" && (
                <div style={{ height: "100%", overflow: "auto" }}>
                  <SapGrid data={alvData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SapStatusBar status={statusMessage} activeLessonId={activeLesson.id} />
    </div>
  );
}

export default App;
