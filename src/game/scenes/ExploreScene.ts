import Phaser from 'phaser';
import { updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';

export class ExploreScene extends Phaser.Scene {
  constructor() { super('ExploreScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#203628');
    addBackButton(this);
    addTitle(this, '探索地図', '目的地を選んで遠征する');

    const result = this.add.text(195, 525, '行き先を選ぶ', { fontSize: '16px', color: '#ecf3e8', align: 'center' }).setOrigin(0.5);
    const locations = [
      ['森', 92, 265, 0x467243],
      ['山', 305, 245, 0x73766f],
      ['遺跡', 195, 365, 0x7d6849]
    ] as const;

    locations.forEach(([name, x, y, color]) => {
      const node = this.add.circle(x, y, 48, color).setStrokeStyle(4, 0xd2b36e).setInteractive({ useHandCursor: true });
      this.add.text(x, y, name, { fontSize: '20px', fontStyle: 'bold', color: '#fff2bf' }).setOrigin(0.5);
      node.on('pointerup', () => {
        const loot = Phaser.Math.Between(1, 3);
        updateSave((save) => ({ ...save, discoveries: save.discoveries + 1, loot: save.loot + loot }));
        result.setText(`${name}を探索
新しい発見！ 戦利品 +${loot}`);
      });
    });
  }
}
