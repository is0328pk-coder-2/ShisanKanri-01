from __future__ import annotations
import json
import os
import sqlite3
from pathlib import Path
from typing import Any
APP_NAME = "ShisanKanri"
DB_FILENAME = "assets.sqlite3"
BACKUP_DIRNAME = "backups"
def default_settings_path() -> Path:
    if os.name == "nt" and os.getenv("APPDATA"):
        base = Path(os.environ["APPDATA"])
    else:
        base = Path.home() / ".config"
    return base / APP_NAME / "settings.json"
def load_settings(path: Path | None = None) -> dict[str, Any]:
    settings_path = path or default_settings_path()
    try:
        with settings_path.open("r", encoding="utf-8") as stream:
            data = json.load(stream)
    except FileNotFoundError:
        return {}
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"設定ファイルを読み込めません。ファイルを確認してください。 ({exc})") from exc
    if not isinstance(data, dict):
        raise RuntimeError("設定ファイルの形式が正しくありません。内容を確認してください。")
    return data
def save_settings(settings: dict[str, Any], path: Path | None = None) -> None:
    settings_path = path or default_settings_path()
    try:
        settings_path.parent.mkdir(parents=True, exist_ok=True)
        temporary_path = settings_path.with_suffix(settings_path.suffix + ".tmp")
        with temporary_path.open("w", encoding="utf-8") as stream:
            json.dump(settings, stream, ensure_ascii=False, indent=2)
        temporary_path.replace(settings_path)
    except OSError as exc:
        raise RuntimeError(f"設定を保存できません。保存先の権限と空き容量を確認してください。 ({exc})") from exc
def database_path_for(folder: Path) -> Path:
    return folder.expanduser() / DB_FILENAME
def initialize_database(folder: Path) -> Path:
    folder = folder.expanduser()
    try:
        folder.mkdir(parents=True, exist_ok=True)
        db_path = database_path_for(folder)
        with sqlite3.connect(db_path) as connection:
            connection.execute("PRAGMA foreign_keys = ON")
            connection.executescript("""
            CREATE TABLE IF NOT EXISTS assets (
                id INTEGER PRIMARY KEY,
                asset_type TEXT NOT NULL CHECK (asset_type IN ('cash', 'deposit', 'stock', 'fund')),
                name TEXT NOT NULL,
                institution TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT '',
                quantity REAL NOT NULL DEFAULT 0 CHECK (quantity >= 0),
                average_cost REAL NOT NULL DEFAULT 0 CHECK (average_cost >= 0),
                current_price REAL NOT NULL DEFAULT 0 CHECK (current_price >= 0),
                balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
                acquired_on TEXT, memo TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS asset_snapshots (
                id INTEGER PRIMARY KEY, recorded_on TEXT NOT NULL,
                total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(recorded_on)
            );
            CREATE TABLE IF NOT EXISTS dividends (
                id INTEGER PRIMARY KEY, asset_id INTEGER, stock_name TEXT NOT NULL,
                amount INTEGER NOT NULL CHECK (amount >= 0), received_on TEXT NOT NULL,
                memo TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY, name TEXT NOT NULL,
                target_amount INTEGER NOT NULL CHECK (target_amount > 0), target_on TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(asset_type);
            CREATE INDEX IF NOT EXISTS idx_snapshots_date ON asset_snapshots(recorded_on);
            CREATE INDEX IF NOT EXISTS idx_dividends_date ON dividends(received_on);
            """)
        return db_path
    except sqlite3.Error as exc:
        raise RuntimeError(f"データベースにアクセスできません。保存先の権限やファイルの状態を確認してください。データは初期化していません。 ({exc})") from exc
    except OSError as exc:
        raise RuntimeError(f"保存先フォルダを作成または利用できません。場所とアクセス権を確認してください。 ({exc})") from exc
def backup_directory(folder: Path) -> Path:
    return folder.expanduser() / BACKUP_DIRNAME
def connect_database(db_path: Path) -> sqlite3.Connection:
    try:
        connection = sqlite3.connect(db_path)
        connection.execute("PRAGMA foreign_keys = ON")
        return connection
    except sqlite3.Error as exc:
        raise RuntimeError(f"データベースに接続できません。ファイルの状態とアクセス権を確認してください。 ({exc})") from exc
