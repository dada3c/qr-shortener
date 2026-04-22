"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

type UrlRecord = {
  code: string;
  originalUrl: string;
  clicks: number;
  createdAt: string | null;
};

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
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">載入中...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">後台管理</h1>
          <p className="text-gray-400 text-sm">請使用管理員帳號登入</p>
          <button
            onClick={() => signIn("google")}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            使用 Google 登入
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">後台管理</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm hidden sm:block">{session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-400 hover:text-white bg-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              登出
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">載入中...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">共 {urls.length} 筆短網址</p>
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 text-left">
                    <th className="px-4 py-3">短網址</th>
                    <th className="px-4 py-3 hidden md:table-cell">原始網址</th>
                    <th className="px-4 py-3 text-right">點擊</th>
                    <th className="px-4 py-3 text-right hidden md:table-cell">建立時間</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((u) => (
                    <tr key={u.code} className="border-b border-gray-700 last:border-0">
                      <td className="px-4 py-3">
                        <a
                          href={`/${u.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-mono"
                        >
                          {u.code}
                        </a>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-gray-300 truncate max-w-xs block">{u.originalUrl}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-white font-medium">{u.clicks}</td>
                      <td className="px-4 py-3 text-right text-gray-400 hidden md:table-cell">
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
