export type AssetAccount = { id: string; name: string; institution: string; amount: number };
export type AssetAccountInput = Omit<AssetAccount, "id">;
export function validateAssetAccount(input: AssetAccountInput): string | null {
 if (!input.name.trim()) return "口座名を入力してください。";
 if (!Number.isFinite(input.amount) || input.amount < 0) return "金額は0以上の数値で入力してください。";
 if (input.amount > Number.MAX_SAFE_INTEGER) return "金額が大きすぎます。";
 return null;
}
export function totalAssets(accounts: AssetAccount[]): number { return accounts.reduce((sum, account) => sum + account.amount, 0); }
export function yen(amount: number): string { return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(amount); }
