import React from "react";

const SapGrid = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 20, color: "#666", fontStyle: "italic" }}>
        Görüntülenecek tablo verisi yok.
      </div>
    );
  }

  // İlk satırdan başlıkları (Column Headers) çıkar
  const headers = Object.keys(data[0]);

  return (
    <div
      style={{
        flexGrow: 1,
        overflow: "auto",
        background: "#fff",
        fontFamily: "Tahoma, sans-serif",
        fontSize: "12px",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}
      >
        <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <tr
            style={{
              background:
                "linear-gradient(to bottom, #dbe6f3 0%, #c4d4e8 100%)",
              height: "30px",
            }}
          >
            {headers.map((head) => (
              <th
                key={head}
                style={{
                  border: "1px solid #aebfd1",
                  padding: "5px 10px",
                  textAlign: "left",
                  color: "#333",
                  textTransform: "uppercase",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              style={{
                background: index % 2 === 0 ? "#fff" : "#f4f8fb", // Zebra Striping (SAP Style)
                height: "24px",
              }}
            >
              {headers.map((col) => (
                <td
                  key={col}
                  style={{
                    border: "1px solid #dcdcdc",
                    padding: "4px 10px",
                    color: "#333",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          padding: "5px",
          background: "#eee",
          borderTop: "1px solid #ccc",
          fontSize: "11px",
          color: "#666",
        }}
      >
        {data.length} Kayıt Listelendi.
      </div>
    </div>
  );
};

export default SapGrid;
