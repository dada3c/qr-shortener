"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

type UrlRecord = {
  code: string;
  originalUrl: string;
  clicks: number;
  createdAt: string | null;
};

function RelayMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{
        color: "var(--cyan-400)",
        filter: "drop-shadow(0 0 8px rgba(34,211,238,.5))",
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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/urls");
    const data = await res.json();
    setUrls(data.urls ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) fetchUrls();
  }, [session, fetchUrls]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: "var(--fg-3)" }}>
          載入中...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <RelayMark size={48} />
          <span className="ds-eyebrow">DADA3C · 後台</span>
          <h1 className="text-2xl font-bold" style={{ color: "var(--fg-1)" }}>
            後台管理
          </h1>
          <p className="text-sm" style={{ color: "var(--fg-3)" }}>
            請使用管理員帳號登入
          </p>
          <button onClick={() => signIn("google")} className="ds-btn-primary mt-2">
            使用 Google 登入
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RelayMark size={28} />
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--fg-1)" }}
            >
              後台管理
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-mono hidden sm:block"
              style={{ color: "var(--fg-3)" }}
            >
              {session.user?.email}
            </span>
            <button onClick={() => signOut()} className="ds-btn-subtle">
              登出
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: "var(--fg-3)" }}>
            載入中...
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="ds-eyebrow">共 {urls.length} 筆短網址</span>
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "var(--glass-fill)",
                backdropFilter: "blur(20px) saturate(140%)",
                WebkitBackdropFilter: "blur(20px) saturate(140%)",
                border: "1px solid var(--glass-stroke)",
                boxShadow: "var(--glow-card)",
              }}
            >
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr
                    className="text-left"
                    style={{
                      color: "var(--fg-3)",
                      borderBottom: "1px solid var(--ink-600)",
                    }}
                  >
                    <th className="px-4 py-3 font-normal">短網址</th>
                    <th className="px-4 py-3 font-normal hidden md:table-cell">
                      原始網址
                    </th>
                    <th className="px-4 py-3 font-normal text-right">點擊</th>
                    <th className="px-4 py-3 font-normal text-right hidden md:table-cell">
                      建立時間
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((u, i) => (
                    <tr
                      key={u.code}
                      style={{
                        borderBottom:
                          i === urls.length - 1
                            ? "0"
                            : "1px solid var(--ink-600)",
                      }}
                    >
                      <td className="px-4 py-3">
                        <a
                          href={`/${u.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono"
                          style={{
                            color: "var(--cyan-400)",
                            textDecoration: "none",
                            textShadow: "0 0 10px rgba(34,211,238,.25)",
                          }}
                        >
                          {u.code}
                        </a>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className="block overflow-hidden text-ellipsis whitespace-nowrap max-w-xs"
                          style={{ color: "var(--fg-2)" }}
                        >
                          {u.originalUrl}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-right font-medium"
                        style={{ color: "var(--fg-1)" }}
                      >
                        {u.clicks}
                      </td>
                      <td
                        className="px-4 py-3 text-right hidden md:table-cell font-mono"
                        style={{ color: "var(--fg-4)", fontSize: "0.75rem" }}
                      >
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("zh-TW")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
