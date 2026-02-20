const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { exec } = require("child_process");

const { Transpiler } = require("@abaplint/transpiler");
const { Registry, MemoryFile, Config } = require("@abaplint/core");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/run", async (req, res) => {
  let userCode = req.body.code;
  console.log("--> Kod işleniyor (Smart Fix Mode V4)...");

  try {
    // --- 🧠 SMART FIX (HATA ÇÖZÜCÜ) ---
    // React'ten gelen verileri işlemek için ABAP kodunu manipüle ediyoruz.

    // 1. SELECTION-SCREEN satırlarını SİL (Transpiler desteklemez, gerek de yok)
    userCode = userCode.replace(/SELECTION-SCREEN.*/gi, "");

    // 2. PARAMETERS -> DATA
    userCode = userCode.replace(/PARAMETERS:/gi, "DATA:");
    userCode = userCode.replace(/PARAMETERS/gi, "DATA");

    // 3. DEFAULT -> VALUE
    userCode = userCode.replace(/DEFAULT/gi, "VALUE");

    // 4. AS CHECKBOX -> TYPE c LENGTH 1
    userCode = userCode.replace(/AS\s+CHECKBOX/gi, "TYPE c LENGTH 1");

    // 5. RADIOBUTTON -> TYPE c LENGTH 1
    userCode = userCode.replace(
      /RADIOBUTTON\s+GROUP\s+\w+/gi,
      "TYPE c LENGTH 1",
    );

    // 6. OBLIGATORY, LOWER CASE, VISIBLE LENGTH temizliği
    userCode = userCode.replace(/OBLIGATORY/gi, "");
    userCode = userCode.replace(/LOWER\s+CASE/gi, "");
    userCode = userCode.replace(/VISIBLE\s+LENGTH\s+\d+/gi, "");

    // -----------------------------------

    // 1. ABAP Ortamı Hazırlığı
    const file = new MemoryFile("z_user_report.prog.abap", userCode);

    // MOCK: ALV Sınıfı
    const clDemoDef = new MemoryFile(
      "cl_demo_output.clas.abap",
      `
            CLASS cl_demo_output DEFINITION PUBLIC.
              PUBLIC SECTION.
                CLASS-METHODS display IMPORTING data TYPE any.
            ENDCLASS.
            CLASS cl_demo_output IMPLEMENTATION.
              METHOD display.
              ENDMETHOD.
            ENDCLASS.
        `,
    );

    // MOCK: Hata Sınıfları
    const cxRootDef = new MemoryFile(
      "cx_root.clas.abap",
      `
            CLASS cx_root DEFINITION PUBLIC. ENDCLASS.
            CLASS cx_root IMPLEMENTATION. ENDCLASS.
        `,
    );
    const cxZeroDef = new MemoryFile(
      "cx_sy_zerodivide.clas.abap",
      `
            CLASS cx_sy_zerodivide DEFINITION PUBLIC INHERITING FROM cx_root. ENDCLASS.
            CLASS cx_sy_zerodivide IMPLEMENTATION. ENDCLASS.
        `,
    );

    const config = new Config(
      JSON.stringify({
        global: { files: "/**/*.*" },
        syntax: { version: "v702", errorNamespace: "." },
        rules: {
          when_others_last: false,
          avoid_use: false,
          unknown_types: false,
          parser_error: true,
          check_syntax: false,
        },
      }),
    );

    const reg = new Registry(config)
      .addFile(file)
      .addFile(clDemoDef)
      .addFile(cxRootDef)
      .addFile(cxZeroDef);

    await reg.parseAsync();

    // 2. Transpile (ABAP -> JS)
    const transpiler = new Transpiler();
    const result = await transpiler.run(reg);

    let mainObj = result.objects.find((o) => o.type === "PROG");
    if (!mainObj) {
      mainObj = result.objects.find((o) => {
        const name = o.name ? o.name.toUpperCase() : "";
        return !["CL_DEMO_OUTPUT", "CX_ROOT", "CX_SY_ZERODIVIDE"].includes(
          name,
        );
      });
    }

    if (!mainObj) throw new Error("Rapor bulunamadı.");

    const generatedJs = mainObj.chunk.getCode();

    // 3. Çalıştırma
    const tempFileName = `run_${Date.now()}.js`;

    const fileContent = `
            const { ABAP } = require('@abaplint/runtime');
            const abap = new ABAP();
            global.abap = abap;

            let consoleBuffer = [];
            abap.console.add = (str) => { consoleBuffer.push(str); };

            // ALV Mock
            abap.Classes['CL_DEMO_OUTPUT'] = class {
                static display(input) {
                    let actualData = input;
                    if (input && input.data) actualData = input.data;
                    global.tempAlvData = actualData;
                }
            };
            abap.Classes['CL_DEMO_OUTPUT'].display.call = abap.Classes['CL_DEMO_OUTPUT'].display;

            // Exception Mocks
            abap.Classes['CX_ROOT'] = class {
                constructor() { this.text = "Hata"; }
                get_text() { return "Hata oluştu"; }
            };
            abap.Classes['CX_SY_ZERODIVIDE'] = class extends abap.Classes['CX_ROOT'] {
                constructor() { super(); }
            };

            async function run() {
                try {
                    // --- ABAP KODU ---
                    ${generatedJs}
                    
                    // --- ÇALIŞTIR ---
                    for (const c in abap.Classes) {
                        if (!['CL_DEMO_OUTPUT', 'CX_ROOT', 'CX_SY_ZERODIVIDE'].includes(c) && abap.Classes[c].run) {
                            await abap.Classes[c].run();
                            break;
                        }
                    }

                    // --- SONUÇ ---
                    function safeJson(val) {
                        if (val === undefined || val === null) return null;
                        if (typeof val.array === 'function') return val.array().map(row => safeJson(row));
                        if (val.get) {
                            try {
                                let raw = val.get();
                                if (typeof raw === 'object' && raw !== null) {
                                    let obj = {};
                                    for (let k in raw) obj[k] = safeJson(raw[k]);
                                    return obj;
                                }
                                return raw;
                            } catch (e) { return "DATA_ERROR"; }
                        }
                        return val;
                    }

                    console.log(JSON.stringify({
                        console: consoleBuffer.join('\\n'),
                        alv: safeJson(global.tempAlvData)
                    }));

                } catch (e) {
                    console.log(JSON.stringify({ error: e.message }));
                }
            }
            
            run();
        `;

    fs.writeFileSync(tempFileName, fileContent);

    exec(`node ${tempFileName}`, (error, stdout, stderr) => {
      fs.unlinkSync(tempFileName);
      if (stderr && !stdout) return res.json({ output: `⚠️ HATA: ${stderr}` });

      try {
        if (!stdout) return res.json({ output: "⚠️ Çıktı alınamadı." });

        const result = JSON.parse(stdout);
        if (result.error)
          return res.json({ output: `RUNTIME_ERROR: ${result.error}` });

        res.json({
          output: result.console || "İşlem Tamamlandı.",
          alv: result.alv || null,
        });
      } catch (e) {
        res.json({ output: stdout });
      }
    });
  } catch (error) {
    console.error("Sistem Hatası:", error);
    res.json({ output: `⚠️ SİSTEM HATASI:\n${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Backend hazır (Final V4 - Selection Screen Fix): http://localhost:${PORT}`,
  );
});
