"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

function RelayMark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{
        color: "var(--cyan-400)",
        filter: "drop-shadow(0 0 14px rgba(34,211,238,.5))",
      }}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35" />
      <path d="M32 8 A24 24 0 0 1 56 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 50 A18 18 0 0 1 14 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M14 44 L32 32 L50 20" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 20 L42 22 M50 20 L48 28" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [chipHover, setChipHover] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  async function handleShorten() {
    setError("");
    setShortUrl("");
    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setShortUrl(data.shortUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadQR() {
    const canvas = qrRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <RelayMark size={56} />
          <span className="ds-eyebrow">DADA3C · 短網址中繼站</span>
          <h1
            className="text-4xl font-bold text-center leading-tight"
            style={{ color: "var(--fg-1)", letterSpacing: "-0.02em" }}
          >
            董達達
            <span
              style={{
                color: "var(--cyan-400)",
                textShadow: "0 0 18px rgba(34,211,238,.4)",
              }}
            >
              短網址
            </span>
            轉運站
          </h1>
          <p className="text-sm text-center" style={{ color: "var(--fg-3)" }}>
            貼入長網址，立即取得短連結與 QR Code
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span className="ds-eyebrow">貼入網址 ➝ 開始轉運</span>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && url && handleShorten()}
                placeholder="https://example.com/very/long/url"
                className="ds-input"
              />
              <button
                onClick={handleShorten}
                disabled={loading || !url}
                className="ds-btn-primary"
              >
                {loading ? "處理中..." : "縮短"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm px-1" style={{ color: "var(--fg-error)" }}>
              {error}
            </p>
          )}

          {shortUrl && (
            <>
              <div className="flex flex-col gap-2">
                <span className="ds-eyebrow">短網址已建立</span>
                <div
                  onMouseEnter={() => setChipHover(true)}
                  onMouseLeave={() => setChipHover(false)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-[14px]"
                  style={{
                    background: "var(--glass-fill)",
                    backdropFilter: "blur(20px) saturate(140%)",
                    WebkitBackdropFilter: "blur(20px) saturate(140%)",
                    border: `1px solid ${chipHover ? "var(--glass-stroke-hi)" : "var(--glass-stroke)"}`,
                    boxShadow: chipHover ? "var(--glow-card-hi)" : "var(--glow-card)",
                    transition: "all var(--duration-med) var(--ease-out)",
                  }}
                >
                  <span className="ds-pulse-dot" />
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap font-mono"
                    style={{
                      color: "var(--cyan-400)",
                      textShadow: "0 0 14px rgba(34,211,238,.3)",
                      textDecoration: "none",
                    }}
                  >
                    {shortUrl}
                  </a>
                  {chipHover && (
                    <span
                      className="font-mono whitespace-nowrap hidden sm:inline"
                      style={{
                        fontSize: "0.625rem",
                        color: "var(--fg-4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      301 跳轉 · 6 字元
                    </span>
                  )}
                  <button onClick={handleCopy} className="ds-btn-chip shrink-0">
                    {copied ? "已複製！" : "複製"}
                  </button>
                </div>
              </div>

              <div
                className="flex flex-col sm:flex-row gap-6 items-center p-6 rounded-[20px]"
                style={{
                  background: "var(--glass-fill)",
                  backdropFilter: "blur(20px) saturate(140%)",
                  WebkitBackdropFilter: "blur(20px) saturate(140%)",
                  border: "1px solid var(--glass-stroke)",
                  boxShadow: "var(--glow-card)",
                }}
              >
                <div className="flex-1 flex flex-col gap-2 w-full">
                  <span className="ds-eyebrow">掃描 · 連線 · 出發</span>
                  <span
                    className="text-lg font-semibold"
                    style={{ color: "var(--fg-1)" }}
                  >
                    掃描 QR Code
                  </span>
                  <div
                    className="flex flex-wrap gap-3 mt-1 font-mono"
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--fg-4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    <span>
                      尺寸{" "}
                      <b
                        style={{
                          color: "var(--cyan-400)",
                          fontWeight: 500,
                        }}
                      >
                        200×200
                      </b>
                    </span>
                    <span>
                      容錯{" "}
                      <b
                        style={{
                          color: "var(--cyan-400)",
                          fontWeight: 500,
                        }}
                      >
                        L
                      </b>
                    </span>
                    <span>
                      格式{" "}
                      <b
                        style={{
                          color: "var(--cyan-400)",
                          fontWeight: 500,
                        }}
                      >
                        PNG
                      </b>
                    </span>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={handleDownloadQR}
                      className="ds-btn-subtle"
                    >
                      下載 QR Code ↓
                    </button>
                  </div>
                </div>
                <div
                  className="bg-white p-3 rounded-[14px] flex"
                  style={{
                    boxShadow: "0 0 40px rgba(46,126,255,.25)",
                  }}
                >
                  <QRCodeCanvas
                    ref={qrRef}
                    value={shortUrl}
                    size={160}
                    marginSize={1}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
