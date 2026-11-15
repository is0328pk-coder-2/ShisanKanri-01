from __future__ import annotations
import sqlite3
from contextlib import closing
import tempfile
import unittest
from pathlib import Path
from asset_manager.storage import backup_directory, database_path_for, initialize_database, load_settings, save_settings
class StorageTests(unittest.TestCase):
    def test_database_is_created_with_expected_tables(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            db_path = initialize_database(Path(directory) / "nested" / "data")
            with closing(sqlite3.connect(db_path)) as connection, connection:
                tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            self.assertTrue({"assets", "asset_snapshots", "dividends", "goals", "app_settings"}.issubset(tables))
    def test_existing_data_survives_reinitialization(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            db_path = initialize_database(folder)
            with closing(sqlite3.connect(db_path)) as connection, connection:
                connection.execute("INSERT INTO goals(name, target_amount) VALUES (?, ?)", ("test", 12345))
            initialize_database(folder)
            with closing(sqlite3.connect(db_path)) as connection, connection:
                row = connection.execute("SELECT name, target_amount FROM goals").fetchone()
            self.assertEqual(row, ("test", 12345))
    def test_settings_are_persisted_separately(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            settings_path = Path(directory) / "settings" / "settings.json"
            save_settings({"data_folder": "D:/AssetManager/data"}, settings_path)
            self.assertEqual(load_settings(settings_path)["data_folder"], "D:/AssetManager/data")
            self.assertFalse(settings_path.parent.joinpath("assets.sqlite3").exists())
    def test_paths_keep_database_and_backups_separate(self) -> None:
        folder = Path("D:/AssetManager/data")
        self.assertEqual(database_path_for(folder), folder / "assets.sqlite3")
        self.assertEqual(backup_directory(folder), folder / "backups")
if __name__ == "__main__":
    unittest.main()
