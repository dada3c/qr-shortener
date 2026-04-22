"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
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
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">董達達短網址轉運站</h1>
          <p className="text-gray-400">貼入長網址，立即取得短連結與 QR Code</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              placeholder="https://example.com/very/long/url"
              className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleShorten}
              disabled={loading || !url}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              {loading ? "處理中..." : "縮短"}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm px-1">{error}</p>
          )}

          {shortUrl && (
            <>
              <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-3">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-400 hover:text-blue-300 text-sm truncate"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  {copied ? "已複製！" : "複製"}
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 bg-gray-800 rounded-xl p-6">
                <p className="text-gray-400 text-sm">掃描 QR Code</p>
                <div className="bg-white p-3 rounded-xl">
                  <QRCodeCanvas
                    ref={qrRef}
                    value={shortUrl}
                    size={200}
                    marginSize={1}
                  />
                </div>
                <button
                  onClick={handleDownloadQR}
                  className="text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  下載 QR Code
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
