import test from "node:test";
import assert from "node:assert/strict";
import { totalAssets, validateAssetAccount, type AssetAccount } from "./assets";
test("validates account names and nonnegative finite amounts", () => {
 assert.equal(validateAssetAccount({ name: " ", institution: "", amount: 1 }), "口座名を入力してください。");
 assert.equal(validateAssetAccount({ name: "普通預金", institution: "", amount: -1 }), "金額は0以上の数値で入力してください。");
 assert.equal(validateAssetAccount({ name: "普通預金", institution: "", amount: Number.NaN }), "金額は0以上の数値で入力してください。");
 assert.equal(validateAssetAccount({ name: "普通預金", institution: "", amount: 1000 }), null);
});
test("sums account balances", () => {
 const accounts: AssetAccount[] = [{ id: "1", name: "現金", institution: "", amount: 12000 }, { id: "2", name: "普通預金", institution: "銀行", amount: 88000 }];
 assert.equal(totalAssets(accounts), 100000);
});
