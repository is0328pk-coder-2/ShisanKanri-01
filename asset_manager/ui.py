from __future__ import annotations
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk
from .storage import backup_directory, initialize_database, load_settings, save_settings
class AssetManagerApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("資産管理")
        self.root.geometry("960x640")
        self.root.minsize(720, 480)
        self.data_folder: Path | None = None
        self.db_path: Path | None = None
        self._build_dashboard()
        self._select_initial_storage()
    def _build_dashboard(self) -> None:
        container = ttk.Frame(self.root, padding=24)
        container.pack(fill="both", expand=True)
        ttk.Label(container, text="資産管理", font=("Yu Gothic UI", 22, "bold")).pack(anchor="w")
        ttk.Label(container, text="ローカルに保存する個人向け資産管理アプリ", foreground="#52635a").pack(anchor="w", pady=(4, 22))
        summary = ttk.LabelFrame(container, text="ダッシュボード", padding=20)
        summary.pack(fill="x")
        ttk.Label(summary, text="総資産額", font=("Yu Gothic UI", 12)).pack(anchor="w")
        ttk.Label(summary, text="¥0", font=("Yu Gothic UI", 28, "bold")).pack(anchor="w", pady=(4, 0))
        ttk.Label(container, text="Phase 1: データ保存先とローカルDBの初期設定", foreground="#52635a").pack(anchor="w", pady=(20, 4))
        self.path_label = ttk.Label(container, text="データ保存先を設定してください", wraplength=850)
        self.path_label.pack(anchor="w")
        ttk.Button(container, text="保存先を変更", command=self._choose_storage).pack(anchor="w", pady=12)
        ttk.Label(container, text="この初期版では資産情報の登録画面は次の開発段階で追加します。").pack(anchor="w", pady=(12, 0))
    def _select_initial_storage(self) -> None:
        try:
            settings = load_settings()
        except RuntimeError as exc:
            messagebox.showerror("設定を読み込めません", str(exc), parent=self.root)
            self.root.after(100, self._choose_storage)
            return
        configured = settings.get("data_folder")
        if configured and Path(configured).is_dir():
            self._use_storage(Path(configured))
        else:
            self.root.after(100, self._choose_storage)
    def _choose_storage(self) -> None:
        selected = filedialog.askdirectory(title="データ保存先フォルダを選択してください", parent=self.root)
        if not selected:
            if self.db_path is None:
                messagebox.showinfo("保存先が未設定です", "データ保存先を設定するとアプリを利用できます。", parent=self.root)
            return
        self._use_storage(Path(selected))
    def _use_storage(self, folder: Path) -> None:
        try:
            db_path = initialize_database(folder)
            save_settings({"data_folder": str(folder.resolve())})
        except (OSError, RuntimeError) as exc:
            messagebox.showerror("保存先を利用できません", str(exc), parent=self.root)
            return
        self.data_folder = folder
        self.db_path = db_path
        self.path_label.configure(text=f"データベース: {db_path}\nバックアップ: {backup_directory(folder)}")
def run() -> None:
    root = tk.Tk()
    AssetManagerApp(root)
    root.mainloop()
