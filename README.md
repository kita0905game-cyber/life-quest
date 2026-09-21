# LIFE QUEST

iPhoneの縦画面を主役に、PCでも遊べる自分専用の長期箱庭RPGです。世界そのものを触って進める設計を維持しつつ、2026-09-22からLUNA COREを正本バックエンドとして運用します。

## 現行アーキテクチャ

- React 19 + TypeScript + Vite
- Phaser 3
- `vite-plugin-pwa`
- GitHub: LIFE QUESTクライアントとゲームロジックの正本
- LUNA CORE / Cloudflare Workers: LIFE QUEST GameStateの正本、ゲーム同期、学習イベントからLQ通貨・XP等を生成
- AppDeploy: ユーザーの簿記学習UI
- Airtable: ユーザーの学習データ記録エリア

学習からゲームへの流れは以下です。

```text
AppDeployで回答
  -> Airtableへ学習結果を記録
  -> 保存成功した回答IDをLUNA COREへ通知
  -> GitHub上のLUNA COREロジックがLQ / XP / 採掘力 / エサ / BOSS進行を計算
  -> LUNA COREのGameStateへ反映
  -> LIFE QUEST PWAが同期
```

## セーブ方式

LIFE QUESTの正本はLUNA COREです。

クライアントは操作感を損なわないためローカルへ即時反映し、各操作を一意のmutation ID付きでLUNA COREへ同期します。通信断時は未送信操作を端末に保持し、再接続後に再送します。LUNA CORE側ではmutation IDで重複適用を防ぎます。

2026-09-21までAppDeployに存在したGameStateはLUNA COREへgame-onlyで移行済みです。移行元スナップショットは別保存され、簿記回答履歴は移行していません。

## 開発開始

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## 検証とビルド

```bash
npm run typecheck
npm run build
```

## ディレクトリ構成

```text
src/
  game/
    scenes/       Phaserの街・施設画面
    systems/      ゲーム進行ロジック
    data/         固定データ
  save/           LUNA CORE同期・ローカル保険・オフラインキュー
  App.tsx         ReactアプリシェルとHUD
```

## 現在実装済み

- 街から鉱山、釣り、工房、探索、ギルド、博物館、BOSS城、記録、マイハウスへ直接移動
- 鉱山、釣り、工房、探索、ギルド、BOSS、図鑑、記録、マイハウス
- LQ / G / XP / 採掘力 / エサ / 探索チケット / 宝箱表示
- LUNA COREからの初回bootstrap
- ゲーム操作のオフラインキューと重複防止同期
- AppDeploy / Airtable学習イベントからのLQ生成
- 移行済み鉄道・地域倉庫など、現クライアント未対応フィールドの保持

## 運用原則

- 過去の努力、履歴、資産を消さない
- クライアント未対応フィールドを同期時に落とさない
- 学習記録の正本はAirtable
- ゲーム状態の正本はLUNA CORE
- AppDeployは勉強UIでありLIFE QUESTの正本ではない
- destructive migrationやsave resetは行わない
- 将来のMAGI自動更新でもセーブ、履歴、権限、憲法は保護対象

## ホスティング

LIFE QUESTは静的PWAとしてCloudflare Pagesでの公開を想定します。

- Build command: `npm run build`
- Output directory: `dist`

Cloudflare Pagesの公開URLとGit連携はCloudflare側設定で管理します。
