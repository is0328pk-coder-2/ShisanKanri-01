import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "資産ノート | 資産管理", description: "個人向け資産管理ダッシュボード" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}</body></html>; }
