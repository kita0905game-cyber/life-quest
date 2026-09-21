import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';
import { fishCatalog } from '../data/gameData';

export class FishingScene extends Phaser.Scene {
  constructor() { super('FishingScene'); }

  preload() { this.load.image('fishing-bg-v1', './assets/fishing-v1.png'); }

  create() {
    this.cameras.main.setBackgroundColor('#18384a');
    this.add.image(195, 340, 'fishing-bg-v1').setDisplaySize(510, 680);
    this.add.rectangle(195, 340, 390, 680, 0x102734, 0.18);
    addBackButton(this);
    addTitle(this, '釣り場', '魚影を見ながら竿を投げる');

    this.add.rectangle(195, 390, 390, 500, 0x276787, 0.08);
    const fish = this.add.ellipse(110, 300, 64, 20, 0x153b4a, 0.78);
    this.tweens.add({ targets: fish, x: 300, y: 345, duration: 2800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const fish2 = this.add.ellipse(280, 440, 45, 13, 0x102f40, 0.55);
    this.tweens.add({ targets: fish2, x: 90, duration: 3600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    const result = this.add.text(195, 170, '水面に魚影がいる…', { fontSize: '17px', color: '#eaf7fa', align: 'center' }).setOrigin(0.5);
    const bobber = this.add.circle(195, 400, 13, 0xf6eee0).setStrokeStyle(5, 0xe34d42).setVisible(false).setInteractive({ useHandCursor: true });
    const cast = this.add.text(195, 585, '竿を投げる', {
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff1bc',
      backgroundColor: '#334e42',
      padding: { x: 22, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    let waiting = false;
    let bite = false;

    cast.on('pointerup', () => {
      if (waiting) return;
      if (loadSave().bait <= 0) { result.setText('釣りエサが足りない'); return; }
      waiting = true;
      bite = false;
      bobber.setVisible(true).setPosition(Phaser.Math.Between(135, 255), Phaser.Math.Between(350, 455));
      bobber.setScale(0.2);
      this.tweens.add({ targets: bobber, scale: 1, duration: 260, ease: 'Back.out' });
      result.setText('浮きを見て待つ…');
      updateSave((save) => ({ ...save, casts: save.casts + 1 }));
      this.time.delayedCall(Phaser.Math.Between(700, 1600), () => {
        bite = true;
        bobber.setFillStyle(0xffd45c);
        this.tweens.add({ targets: bobber, y: bobber.y + 18, duration: 110, yoyo: true, repeat: 5 });
        result.setText('HIT！ 浮きをタップ！');
      });
    });

    bobber.on('pointerup', () => {
      if (!waiting || !bite) {
        result.setText('まだ早い…');
        return;
      }
      const now = new Date(); const night = now.getHours() >= 19 || now.getHours() < 5; const autumn = now.getMonth() >= 8 && now.getMonth() <= 10;
      const weights: Record<string, number> = { メダカ:22,フナ:18,コイ:12,ブラックバス:10,アジ:12,サバ:10,タイ:5,サケ:autumn?7:2,ウナギ:night?8:3,金魚:4,ニジマス:4,月影ゴイ:night?2:.5 };
      const total = Object.values(weights).reduce((a,b)=>a+b,0); let roll = Math.random()*total; let caught: string = fishCatalog[0];
      for (const fishName of fishCatalog) { roll -= weights[fishName]; if (roll <= 0) { caught = fishName; break; } }
      const size = Phaser.Math.Between(8, 95);
      const updated = updateSave((save) => ({
        ...save,
        bait: save.bait - 1, fishCaught: save.fishCaught + 1,
        fishRecords: { ...save.fishRecords, [caught]: Math.max(save.fishRecords[caught] ?? 0, size) },
        discoveredFish: [...new Set([...save.discoveredFish, caught])],
        fishInventory: { ...save.fishInventory, [caught]: (save.fishInventory[caught] ?? 0) + 1 }
      }));
      result.setText(`${caught} ${size}cm！\n自己最大 ${updated.fishRecords[caught]}cm · エサ残り${updated.bait}`);
      waiting = false;
      bite = false;
      bobber.setVisible(false).setFillStyle(0xf6eee0);
    });
  }
}
