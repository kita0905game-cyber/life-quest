import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';

export class WorkshopScene extends Phaser.Scene {
  constructor() { super('WorkshopScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#30251f');
    addBackButton(this);
    addTitle(this, '工房', '設備を直接使って加工する');

    const furnace = this.add.rectangle(105, 300, 145, 190, 0x784331).setStrokeStyle(4, 0xc89052).setInteractive({ useHandCursor: true });
    this.add.circle(105, 320, 40, 0xef7f38, 0.85);
    this.add.text(105, 225, '炉', { fontSize: '24px', color: '#fff0bc' }).setOrigin(0.5);

    const bench = this.add.rectangle(285, 325, 150, 105, 0x6f5638).setStrokeStyle(4, 0xb9975a).setInteractive({ useHandCursor: true });
    this.add.text(285, 325, '作業台', { fontSize: '22px', color: '#fff0bc' }).setOrigin(0.5);

    const status = this.add.text(195, 500, '炉：鉄鉱石2 → インゴット1\n作業台：インゴット2 → ギア1', { fontSize: '15px', color: '#f2e7cf', align: 'center' }).setOrigin(0.5);

    furnace.on('pointerup', () => {
      const save = loadSave();
      if (save.iron < 2) {
        status.setText(`精錬には鉄鉱石2個必要 / 現在 ${save.iron}`);
        return;
      }
      updateSave((current) => ({ ...current, iron: current.iron - 2, ingots: current.ingots + 1 }));
      status.setText('鉄インゴットを1個精錬した！');
    });
    bench.on('pointerup', () => {
      const save = loadSave();
      if (save.ingots < 2) {
        status.setText(`ギアにはインゴット2個必要 / 現在 ${save.ingots}`);
        return;
      }
      updateSave((current) => ({ ...current, ingots: current.ingots - 2, gears: current.gears + 1 }));
      status.setText('ギアを1個製作した！');
    });
  }
}
