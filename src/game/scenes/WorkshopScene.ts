import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';
import { reward } from '../systems/progression';

export class WorkshopScene extends Phaser.Scene {
  constructor() { super('WorkshopScene'); }

  preload() { this.load.image('workshop-bg-v1', './assets/workshop-v1.png'); }

  create() {
    this.cameras.main.setBackgroundColor('#30251f');
    this.add.image(195, 340, 'workshop-bg-v1').setDisplaySize(510, 680);
    this.add.rectangle(195, 340, 390, 680, 0x1b1009, 0.15);
    addBackButton(this);
    addTitle(this, '工房', '設備を直接使って加工する');

    const furnace = this.add.rectangle(105, 300, 145, 190, 0x3d2118, 0.45).setStrokeStyle(4, 0xf0ad55).setInteractive({ useHandCursor: true });
    const flame = this.add.circle(105, 320, 40, 0xef7f38, 0.72);
    this.tweens.add({ targets: flame, scaleX: 0.78, scaleY: 1.18, alpha: 0.95, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.add.text(105, 225, '炉', { fontSize: '24px', color: '#fff0bc' }).setOrigin(0.5);

    const bench = this.add.rectangle(285, 325, 150, 105, 0x4d3925, 0.55).setStrokeStyle(4, 0xd4ae64).setInteractive({ useHandCursor: true });
    this.add.text(285, 325, '作業台', { fontSize: '22px', color: '#fff0bc' }).setOrigin(0.5);

    const status = this.add.text(195, 500, '炉：鉄鉱石2 → インゴット1\n作業台：インゴット2 → ギア1', { fontSize: '15px', color: '#f2e7cf', align: 'center' }).setOrigin(0.5);

    furnace.on('pointerup', () => {
      const save = loadSave();
      if (save.iron < 2) {
        status.setText(`精錬には鉄鉱石2個必要 / 現在 ${save.iron}`);
        return;
      }
      updateSave((current) => reward({ ...current, iron: current.iron - 2, ingots: current.ingots + 1, crafted: current.crafted + 1 }, 8, 5));
      status.setText('鉄インゴットを1個精錬した！');
      this.cameras.main.flash(180, 255, 136, 45, false);
    });
    bench.on('pointerup', () => {
      const save = loadSave();
      if (save.ingots < 2) {
        status.setText(`ギアにはインゴット2個必要 / 現在 ${save.ingots}`);
        return;
      }
      updateSave((current) => reward({ ...current, ingots: current.ingots - 2, gears: current.gears + 1, crafted: current.crafted + 1 }, 18, 12));
      status.setText('ギアを1個製作した！');
      this.tweens.add({ targets: bench, scaleY: 0.92, duration: 90, yoyo: true, repeat: 2 });
    });
  }
}
