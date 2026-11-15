# 資産ノート（ShisanKanri-01）

個人向け資産管理Webアプリの初期開発です。Next.js App Router、TypeScript、Tailwind CSSを使用します。

## 現在の範囲

- レスポンシブな資産ダッシュボード
- 現金・預金の追加、編集、削除
- 合計残高の自動計算
- 入力値検証

現段階ではデータはページ内の一時状態のみで、再読み込み時に消えます。実際の資産情報を入力しないでください。Firebase Authentication / Firestore等は後続Issueで扱います。本番環境へのデプロイは行いません。

## 開発環境

Node.js 20以上、npmを用意してから実行してください。

    npm install
    npm run dev

## 検証コマンド

    npm test
    npm run typecheck
    npm run lint
    npm run build

## 開発ルール

Issueごとに専用ブランチを使用し、変更と検証結果をPull Requestに記録します。秘密情報/APIキー/実際の資産情報をコミット、ログ、メール、外部プロンプトに含めません。認証・ユーザーデータ分離は適切なセキュリティルールとテストを含む別Issueで実装します。本番デプロイや破壊的なDB変更は人間の承認なしに実行しません。
