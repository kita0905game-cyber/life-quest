# LIFE QUEST Content Masters

AppDeploy版LIFE QUESTで準備していた画像非依存の未来コンテンツ台帳を、Cloudflare版へ移行したもの。

## 移行元
- AppDeploy app: `3-qiawue`
- source version: `v81` (`1789684366808`)
- migrated: 2026-09-22

## 含むデータ
- fishMaster.ts
- worldMaster.ts
- economyMaster.ts
- transportMaster.ts
- societyMaster.ts
- progressionMaster.ts
- contentManifest.ts

カタログ規模は合計956エントリ。

## 重要
このディレクトリに存在することと、ゲームでLIVEであることは別。

- 画像未作成でも `assetKey` と安定IDを保持する。
- PREPAREDはドロップ、図鑑母数、Chapter条件、canonical GameStateへ自動接続しない。
- AppDeploy時代にLIVE表記だった項目も、Cloudflare版での実装状況は個別に確認する。
- LIVE昇格時は既存セーブ互換性、LUNA CORE側のschema/action、画像、入手先、用途を確認する。
- 画像アセットは今回の移行対象外。世界観統一後に別途選定・再制作する。

詳細は `docs/CONTENT_CATALOG.md` と `docs/CONTENT_PIPELINE.md` を参照。
