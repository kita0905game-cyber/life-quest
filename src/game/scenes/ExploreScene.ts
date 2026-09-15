import Phaser from 'phaser';
import { updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';
import { reward } from '../systems/progression';
import { explorationSites } from '../data/gameData';

export class ExploreScene extends Phaser.Scene {
  constructor() { super('ExploreScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#203628');
    addBackButton(this);
    addTitle(this, '探索地図', '目的地を選んで遠征する');

    const result = this.add.text(195, 525, '行き先を選ぶ', { fontSize: '16px', color: '#ecf3e8', align: 'center' }).setOrigin(0.5);
    explorationSites.forEach(({ name, shortName, x, y, color }) => {
      const node = this.add.circle(x, y, 48, color).setStrokeStyle(4, 0xd2b36e).setInteractive({ useHandCursor: true });
      this.add.text(x, y, shortName, { fontSize: '20px', fontStyle: 'bold', color: '#fff2bf' }).setOrigin(0.5);
      node.on('pointerup', () => {
        const loot = Phaser.Math.Between(1, 3);
        updateSave((save) => reward({ ...save, discoveries: save.discoveries + 1, loot: save.loot + loot, exploredLocations: { ...save.exploredLocations, [name]: (save.exploredLocations[name] ?? 0) + 1 } }, 15, 10));
        result.setText(`${name}を探索
新しい発見！ 戦利品 +${loot} · XP+15`);
      });
    });
  }
}
