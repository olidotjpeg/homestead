import { useState } from "react";
import type { ApiKeyScreenProps } from "@/types";
import { DEV_SKIP_KEY } from "@/constants/config";
import { P, serif, sans } from "@/constants/theme";

export function ApiKeyScreen({ onSave }: ApiKeyScreenProps) {
  const [val, setVal] = useState("");

  const isValid = val.trim().startsWith("sk-ant-");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid) onSave(val.trim());
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: P.pageBg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: sans, padding: "24px",
    }}>
      <div style={{
        maxWidth: "400px", width: "100%",
        background: "rgba(255,255,255,.7)",
        borderRadius: "24px", padding: "36px 28px",
        border: `1.5px solid ${P.cardBorder}`,
        backdropFilter: "blur(12px)",
        textAlign: "center",
        boxShadow: "0 10px 40px rgba(180,100,130,.12)",
        animation: "appear .5s ease",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "10px", animation: "float 4s ease-in-out infinite" }}>
          🌸
        </div>

        <h1 style={{ fontFamily: serif, fontSize: "24px", color: P.bark, margin: "0 0 5px" }}>
          The Homestead Garden
        </h1>
        <p style={{ fontSize: "13px", color: P.bark2, fontStyle: "italic", fontFamily: serif, margin: "0 0 24px" }}>
          An API key helps Clover come to life
        </p>

        <div style={{ textAlign: "left", marginBottom: "14px" }}>
          <label htmlFor="apikey" style={{ fontSize: "12px", color: P.bark2, display: "block", marginBottom: "7px", fontFamily: serif }}>
            Anthropic API key
          </label>
          <input
            id="apikey"
            type="password"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="sk-ant-…"
            autoComplete="off"
            style={{
              width: "100%", padding: "11px 13px", borderRadius: "12px",
              border: `1.5px solid ${val && !isValid ? "rgba(200,100,80,.4)" : P.cardBorder}`,
              background: "rgba(255,255,255,.8)",
              fontFamily: sans, fontSize: "13px", color: P.bark,
            }}
          />
          {val && !isValid && (
            <p style={{ margin: "5px 0 0", fontSize: "11px", color: "#c07050", fontStyle: "italic" }}>
              Should start with sk-ant-
            </p>
          )}
        </div>

        <button
          onClick={() => isValid && onSave(val.trim())}
          disabled={!isValid}
          style={{
            width: "100%", padding: "12px", borderRadius: "14px", border: "none",
            background: isValid ? "linear-gradient(135deg,#f4b8cc,#e090aa)" : "rgba(240,195,210,.3)",
            color: isValid ? "#fff" : "#d4a8b8",
            fontFamily: sans, fontSize: "14px", fontWeight: "600",
            cursor: isValid ? "pointer" : "default",
            transition: "all .2s ease",
            boxShadow: isValid ? "0 4px 16px rgba(224,144,170,.4)" : "none",
          }}
        >
          Open the garden 🌸
        </button>

        <p style={{ margin: "16px 0 0", fontSize: "11px", color: P.bark3, fontStyle: "italic", fontFamily: serif, lineHeight: "1.65" }}>
          Saved in this browser only · sent directly to Anthropic
          <br />
          Get one at{" "}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
            style={{ color: P.rose, textDecoration: "none" }}>
            console.anthropic.com
          </a>
        </p>

        <button
          onClick={() => onSave(DEV_SKIP_KEY)}
          style={{
            marginTop: "14px", background: "none", border: "none",
            cursor: "pointer", fontFamily: serif, fontSize: "11px",
            fontStyle: "italic", color: P.bark3, textDecoration: "underline",
            textDecorationStyle: "dotted",
          }}
        >
          skip for now (no Clover)
        </button>
      </div>
    </div>
  );
}
