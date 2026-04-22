# 短網址 — qr.dada3c.tw

貼入長網址，立即取得短連結。

## 技術棧

- **Framework**: Next.js 14 (App Router)
- **Database**: Firebase Firestore
- **部署**: Vercel
- **網域**: qr.dada3c.tw

## 架構

```
qr.dada3c.tw/          → 首頁 UI
qr.dada3c.tw/:code     → 301 redirect 到原始網址
```

## 本地開發

```bash
npm install
cp .env.local.example .env.local
# 填入 Firebase Service Account 憑證
npm run dev
```

## 環境變數

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_BASE_URL` | 短網址的 base URL（例如 `https://qr.dada3c.tw`） |
| `FIREBASE_PROJECT_ID` | Firebase 專案 ID |
| `FIREBASE_CLIENT_EMAIL` | Service Account email |
| `FIREBASE_PRIVATE_KEY` | Service Account private key |

## 授權

[MIT](LICENSE)
