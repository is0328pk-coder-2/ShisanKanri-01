# ShisanKanri-01 — ローカル資産管理アプリ

Windows 10/11向けの個人用デスクトップ資産管理アプリです。Python標準ライブラリのTkinterとSQLiteを使い、資産情報を外部へ送信しません。

## Phase 1

- Tkinterの基本ダッシュボード
- 初回起動時にローカルDB保存先を選択し、設定をユーザー設定領域へ保存
- 指定先にSQLite DBと将来用バックアップフォルダを分けて配置
- 既存DBを初期化せず、不足テーブルのみ作成
- DB、設定、バックアップなどの個人データをGit対象外にする

## 起動

Python 3.10以上をインストールし、リポジトリのルートから実行してください。

    python -m asset_manager

GUIにはTkinterが必要です。Windows標準Pythonの通常インストールでは利用できます。

## テスト

    python -m unittest discover -v

## データ保存場所

- DB: ユーザーが選んだフォルダ内の assets.sqlite3
- バックアップ: 同じフォルダ内の backups フォルダ（Phase 4で機能追加）
- 設定: Windowsでは APPDATA の ShisanKanri/settings.json、その他では ~/.config/ShisanKanri/settings.json

初期版はSQLite、Tkinter、JSON、unittestなど標準ライブラリのみを使います。Matplotlib、Pandas、PyInstaller等は必要になるPhaseで追加します。

## データ保護

実データやDBファイルをGitHubに登録しないでください。保存先やDBにアクセスできない場合は日本語でエラーを表示し、データを削除・初期化しません。復元・削除・外部通知などの重要機能は後続Phaseで明示的な確認を設けます。
