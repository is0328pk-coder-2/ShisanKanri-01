"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function HomePage() {
  const { user, loading, error } = useAuth();
  const [signOutError, setSignOutError] = useState<string | null>(null);

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-slate-600">読み込み中…</main>;
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-5 py-12">
        <section className="w-full rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-bold text-slate-900">Firebaseの設定が必要です</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">{error}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            READMEの手順に従ってFirebase Authenticationを有効にし、環境変数を設定してください。秘密鍵や実際の資産情報は登録しないでください。
          </p>
          <Link className="mt-5 inline-block font-semibold text-emerald-700 underline-offset-4 hover:underline" href="/login/">
            ログイン画面へ
          </Link>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-12">
        <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-bold tracking-wide text-emerald-700">PERSONAL FINANCE</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">資産を、見やすく一か所に。</h1>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">
            現金・預金、国内株式、投資信託をまとめて管理するための個人向け資産管理アプリです。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-lg bg-emerald-700 px-5 py-3 text-center font-semibold text-white hover:bg-emerald-800" href="/login/">
              ログイン
            </Link>
            <Link className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50" href="/register/">
              アカウントを作成
            </Link>
          </div>
          <p className="mt-8 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">
            これは開発中のアプリです。資産の登録・保存機能は未実装です。実際の資産情報は入力しないでください。
          </p>
        </section>
      </main>
    );
  }

  async function handleSignOut() {
    setSignOutError(null);
    try {
      await signOut(getFirebaseAuth());
    } catch {
      setSignOutError("ログアウトできませんでした。もう一度お試しください。");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-semibold text-emerald-700">資産管理</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">ダッシュボード</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="max-w-48 truncate text-sm text-slate-600">{user.email}</span>
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white" onClick={handleSignOut} type="button">
            ログアウト
          </button>
        </div>
      </header>
      {signOutError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{signOutError}</p>}

      <section className="mt-8 rounded-2xl bg-emerald-950 p-6 text-white sm:p-8">
        <p className="text-sm text-emerald-100">総資産</p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">未登録</p>
        <p className="mt-3 text-sm text-emerald-100">資産登録機能の実装後に、保有資産の合計を表示します。</p>
      </section>

      <section aria-label="資産カテゴリ" className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { title: "現金・預金", description: "口座ごとの残高管理" },
          { title: "国内株式", description: "保有数量と評価額の管理" },
          { title: "投資信託", description: "口数と基準価額の管理" },
        ].map((item) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={item.title}>
            <h2 className="font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            <p className="mt-5 text-sm font-medium text-slate-400">未登録</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="font-semibold text-slate-900">次のステップ</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          この初期版ではメールアドレスによるログインとユーザー別Firestoreルールを用意しました。資産データの登録、配当、目標、推移グラフは今後実装します。
        </p>
      </section>
    </main>
  );
}
