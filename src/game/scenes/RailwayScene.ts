import Phaser from 'phaser';
import { loadSave, performGameAction, refreshCloudSave, type GameAction } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';

const automationLabels: Array<{ key: string; label: string; cost: number }> = [
  { key: 'freight_load', label: '積込自動化', cost: 30 },
  { key: 'freight_unload', label: '荷卸自動化', cost: 30 },
  { key: 'maintenance', label: '整備自動化', cost: 30 },
  { key: 'depot', label: '入出庫自動化', cost: 30 },
  { key: 'reserve', label: '予備編成交代', cost: 60 }
];

function secondsUntil(iso: string) {
  const ms = Date.parse(iso) - Date.now();
  return Number.isFinite(ms) ? Math.max(0, Math.ceil(ms / 1000)) : 0;
}

export class RailwayScene extends Phaser.Scene {
  private busy = false;

  constructor() { super('RailwayScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#0d1715');
    addBackButton(this);
    addTitle(this, '鉄道・物流', 'LUNA CORE正本 / 地域生産と輸送');

    const save = loadSave();
    const mountain = save.regionalWarehouses.mountain ?? {
      stone: 0, iron: 0, copper: 0, wood: 0, crystal: 0, ingots: 0, copperIngots: 0, gears: 0, lanterns: 0
    };

    this.add.rectangle(195, 143, 350, 108, 0x17231f, 0.96).setStrokeStyle(1, 0xc9aa62);
    this.add.text(35, 99, '🚂 鉄道', { fontSize: '18px', fontStyle: 'bold', color: '#ffe7a3' });
    this.add.text(35, 128, `保有列車 ${save.railwayTrainCount}編成　車庫 ${save.railwayDepotUnlocked ? '開設済み' : '未開設'}`, { fontSize: '13px', color: '#d9e2dc' });
    this.add.text(35, 151, `鉄鉱石 ${save.iron} / 100`, { fontSize: '13px', color: save.iron >= 100 ? '#aee6b8' : '#d8c99b' });

    if (save.railwayTrainCount === 0) {
      this.addActionButton(195, 182, '初期簡易貨物列車を製造', 'railway_build_first_freight', {}, save.iron >= 100);
    } else {
      this.add.text(195, 181, '✓ 初期簡易貨物列車 稼働準備済み', { fontSize: '13px', color: '#aee6b8' }).setOrigin(0.5);
    }

    this.add.rectangle(195, 296, 350, 176, 0x14221e, 0.96).setStrokeStyle(1, 0x6f927e);
    this.add.text(35, 220, '⛰ 山岳物流', { fontSize: '18px', fontStyle: 'bold', color: '#d9efde' });
    this.add.text(35, 249, `山岳倉庫　石 ${mountain.stone}　鉄 ${mountain.iron}　銅 ${mountain.copper}`, { fontSize: '13px', color: '#d7e4dc' });
    const minerSeconds = secondsUntil(save.minerHiredUntil);
    this.add.text(35, 273, minerSeconds > 0 ? `鉱夫 稼働中　残り約${Math.ceil(minerSeconds / 60)}分` : '鉱夫 停止中', { fontSize: '13px', color: minerSeconds > 0 ? '#9de3b0' : '#b8c0bb' });
    this.addActionButton(111, 316, '鉱夫 +1時間
1200G', 'hire_miner', {}, save.gold >= 1200);
    const warehouseTotal = mountain.stone + mountain.iron + mountain.copper + mountain.wood + mountain.crystal + mountain.ingots + mountain.copperIngots + mountain.gears + mountain.lanterns;
    this.addActionButton(279, 316, '馬車輸送
50G / 30分', 'wagon_mountain_to_main', {}, save.gold >= 50 && warehouseTotal > 0);
    const transfer = save.wagonTransfers.find((item) => item.from === 'mountain' && item.to === 'main');
    if (transfer) {
      const eta = secondsUntil(transfer.arrivesAt);
      this.add.text(195, 356, `馬車輸送中　到着まで約${Math.ceil(eta / 60)}分`, { fontSize: '12px', color: '#f2d795' }).setOrigin(0.5);
    } else {
      this.add.text(195, 356, '馬車待機中', { fontSize: '12px', color: '#8ea098' }).setOrigin(0.5);
    }

    this.add.rectangle(195, 500, 350, 220, 0x171d22, 0.97).setStrokeStyle(1, 0x806d9b);
    this.add.text(35, 398, `✦ LQ自動化　残高 ${save.lq} LQ`, { fontSize: '18px', fontStyle: 'bold', color: '#e7d8ff' });
    automationLabels.forEach((item, index) => {
      const unlocked = save.automations.includes(item.key);
      const y = 438 + index * 34;
      const label = unlocked ? `✓ ${item.label}` : `${item.label}　${item.cost}LQ`;
      const button = this.add.text(195, y, label, {
        fontSize: '13px',
        color: unlocked ? '#a8ddb4' : save.lq >= item.cost ? '#f0e2ff' : '#777f7b',
        backgroundColor: unlocked ? '#20352a' : '#2a2630',
        padding: { x: 10, y: 6 }
      }).setOrigin(0.5);
      if (!unlocked && save.lq >= item.cost) {
        button.setInteractive({ useHandCursor: true });
        button.on('pointerup', () => this.runAction('unlock_automation', { automation: item.key }));
      }
    });

    this.add.text(195, 624, '地域倉庫の資源は自動でメインへ移動しない', { fontSize: '11px', color: '#9dafaa' }).setOrigin(0.5);

    this.time.delayedCall(10000, () => {
      void refreshCloudSave().then(() => {
        if (this.scene.isActive()) this.scene.restart();
      });
    });
  }

  private addActionButton(x: number, y: number, label: string, action: GameAction, params: { automation?: string }, enabled: boolean) {
    const button = this.add.text(x, y, label, {
      align: 'center',
      fontSize: '13px',
      color: enabled ? '#fff4c8' : '#777f7b',
      backgroundColor: enabled ? '#365044' : '#222a27',
      padding: { x: 10, y: 7 }
    }).setOrigin(0.5);

    if (enabled) {
      button.setInteractive({ useHandCursor: true });
      button.on('pointerup', () => this.runAction(action, params));
    }
  }

  private runAction(action: GameAction, params: { automation?: string }) {
    if (this.busy) return;
    this.busy = true;
    const status = this.add.text(195, 650, 'LUNA COREへ送信中…', { fontSize: '12px', color: '#ffe39b' }).setOrigin(0.5);
    void performGameAction(action, params)
      .then(({ message }) => {
        status.setText(message);
        this.time.delayedCall(900, () => this.scene.restart());
      })
      .catch((error: unknown) => {
        this.busy = false;
        status.setColor('#ffb4a9');
        status.setText(error instanceof Error ? error.message : '処理に失敗しました');
      });
  }
}
