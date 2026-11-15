# ShisanKanri-01

個人向けの資産管理Webアプリです。Next.js、TypeScript、Tailwind CSS、Firebase Authentication、Cloud Firestore、Firebase Hostingを利用します。

## 現在の状態

初期基盤として、メールアドレス認証、レスポンシブなダッシュボードの枠組み、ユーザー単位のFirestoreルール、CIを用意しています。資産の登録・編集・削除、評価額集計、配当、目標、スナップショットは未実装です。開発中は実際の資産情報を入力しないでください。

## 開発環境

- Node.js 22.12以降
- npm
- Firebaseプロジェクト（Authenticationのメール/パスワード認証を有効化）

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`にFirebase Webアプリの設定値を入力します。APIキーなどの設定値をGitへコミットしないでください。Webアプリ用Firebase APIキーはクライアントに公開される前提ですが、Firestoreのアクセス制御は必ずセキュリティルールで行います。

## 検証

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Firebase Hosting

`npm run build`は静的出力を`out/`へ生成します。Firebase HostingへのデプロイとFirestoreルールの反映は、本番環境への影響を確認し、人間の承認を得てから行ってください。
