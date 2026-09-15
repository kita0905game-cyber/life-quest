# LIFE QUEST

iPhoneの縦画面を主役に、PCでも遊べる自分専用の長期箱庭RPGです。V0.1では「カードを選ぶ」のではなく、街や設備、岩盤、水面、探索地点など世界そのものを触って進めます。

## 技術構成

- React 19 + TypeScript + Vite
- Phaser 3（ゲーム世界、入力、演出）
- `vite-plugin-pwa`（Manifest、Service Worker、standalone表示）
- localStorage（`SaveRepository`の抽象化層経由、セーブ形式version 1）

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
  save/           差し替え可能なSaveRepository
  App.tsx         ReactのアプリシェルとHUD
```

今後は固定定義を`game/data`、ゲームルールを`game/systems`、登場物を`game/entities`へ分離して拡張します。

## 現在実装済み

- 街：鉱山、釣り、工房、探索へ世界内の施設から移動
- 鉱山：岩盤タップ、ヒビ、破壊、エネルギー消費、石・鉄鉱石、深度進行
- 釣り：動く魚影、投擲、浮きのHIT操作、魚種・サイズ・自己最大記録
- 工房：炉で鉄鉱石からインゴット、作業台でインゴットからギアを製作
- 探索：地図上の森・山・遺跡を選び、発見と戦利品を獲得
- 全施設から街へ戻る操作と、リロード後も残るversion付きセーブ
- Safe Areaを考慮したスマホ縦画面と、PCでの中央表示

## セーブ方式

ゲームコードはlocalStorageを直接触らず、`SaveRepository`インターフェースを使います。将来はSupabase、Cloudflare、独自API、PC・スマホ同期用の実装へ差し替えられます。

## 次の候補

駅、研究所、博物館、図書館、BOSS城、牧場、ギルド、商店、マイハウス、採掘ルート、ツルハシビルド、釣り場・天候・ヌシ、生産キュー、遠征とオフライン帰還を追加予定です。次の最優先は、鉱山のルート選択と鉱脈・遺跡イベントです。

## Cloudflare Pages

GitHubリポジトリをCloudflare Pagesに接続し、次を設定します。

- Build command: `npm run build`
- Output directory: `dist`

環境変数はV0.1では不要です。
