"use client";

import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";

type AuthFormProps = { mode: "sign-in" | "sign-up" };

function getErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/invalid-credential") return "メールアドレスまたはパスワードを確認してください。";
    if (error.code === "auth/email-already-in-use") return "このメールアドレスは既に登録されています。";
    if (error.code === "auth/weak-password") return "パスワードは8文字以上にしてください。";
    if (error.code === "auth/invalid-email") return "メールアドレスの形式を確認してください。";
  }
  if (error instanceof Error && error.message.startsWith("Firebase configuration is missing")) {
    return "Firebaseの設定がありません。.env.localを設定してください。";
  }
  return "認証に失敗しました。入力内容とFirebaseの設定を確認してください。";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const auth = getFirebaseAuth();
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace("/");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5 py-12">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link className="text-sm font-semibold text-emerald-700" href="/">
          資産管理
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          {isSignUp ? "アカウントを作成" : "ログイン"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isSignUp ? "メールアドレスで利用を開始します。" : "登録済みのメールアドレスでログインしてください。"}
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            メールアドレス
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            パスワード
            <input
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}
          <button
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "処理中…" : isSignUp ? "アカウントを作成" : "ログイン"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isSignUp ? "すでに登録済みですか？" : "アカウントをお持ちでないですか？"}{" "}
          <Link className="font-semibold text-emerald-700 underline-offset-4 hover:underline" href={isSignUp ? "/login/" : "/register/"}>
            {isSignUp ? "ログイン" : "新規登録"}
          </Link>
        </p>
      </section>
    </main>
  );
}
