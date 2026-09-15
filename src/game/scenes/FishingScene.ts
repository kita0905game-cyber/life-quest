import Phaser from 'phaser';
import { updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';
import { reward } from '../systems/progression';
import { fishCatalog } from '../data/gameData';

export class FishingScene extends Phaser.Scene {
  constructor() { super('FishingScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#18384a');
    addBackButton(this);
    addTitle(this, '釣り場', '魚影を見ながら竿を投げる');

    this.add.rectangle(195, 390, 390, 500, 0x276787);
    const fish = this.add.ellipse(110, 300, 64, 20, 0x153b4a, 0.78);
    this.tweens.add({ targets: fish, x: 300, y: 345, duration: 2800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

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
      waiting = true;
      bite = false;
      bobber.setVisible(true).setPosition(Phaser.Math.Between(135, 255), Phaser.Math.Between(350, 455));
      result.setText('浮きを見て待つ…');
      updateSave((save) => ({ ...save, casts: save.casts + 1 }));
      this.time.delayedCall(Phaser.Math.Between(700, 1600), () => {
        bite = true;
        bobber.setFillStyle(0xffd45c);
        result.setText('HIT！ 浮きをタップ！');
      });
    });

    bobber.on('pointerup', () => {
      if (!waiting || !bite) {
        result.setText('まだ早い…');
        return;
      }
      const caught = Phaser.Utils.Array.GetRandom([...fishCatalog]);
      const size = Phaser.Math.Between(18, 54);
      const updated = updateSave((save) => reward({
        ...save,
        fishCaught: save.fishCaught + 1,
        fishRecords: { ...save.fishRecords, [caught]: Math.max(save.fishRecords[caught] ?? 0, size) }
      }, 12, 15));
      result.setText(`${caught} ${size}cm！\n自己最大 ${updated.fishRecords[caught]}cm · XP+12`);
      waiting = false;
      bite = false;
      bobber.setVisible(false).setFillStyle(0xf6eee0);
    });
  }
}
