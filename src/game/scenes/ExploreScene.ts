import Phaser from 'phaser';
import { updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';
import { reward } from '../systems/progression';
import { explorationSites } from '../data/gameData';

export class ExploreScene extends Phaser.Scene {
  constructor() { super('ExploreScene'); }

  preload() { this.load.image('explore-bg-v1', './assets/explore-v1.png'); }

  create() {
    this.cameras.main.setBackgroundColor('#203628');
    this.add.image(195, 340, 'explore-bg-v1').setDisplaySize(510, 680);
    this.add.rectangle(195, 340, 390, 680, 0x071210, 0.18);
    addBackButton(this);
    addTitle(this, '探索地図', '目的地を選んで遠征する');

    const result = this.add.text(195, 525, '行き先を選ぶ', { fontSize: '16px', color: '#ecf3e8', align: 'center' }).setOrigin(0.5);
    explorationSites.forEach(({ name, shortName, x, y, color }) => {
      const node = this.add.circle(x, y, 48, color).setStrokeStyle(4, 0xd2b36e).setInteractive({ useHandCursor: true });
      this.add.text(x, y, shortName, { fontSize: '20px', fontStyle: 'bold', color: '#fff2bf' }).setOrigin(0.5);
      this.tweens.add({ targets: node, scale: 1.08, alpha: 0.88, duration: 1100 + x, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      node.on('pointerup', () => {
        const loot = Phaser.Math.Between(1, 3);
        updateSave((save) => reward({ ...save, discoveries: save.discoveries + 1, loot: save.loot + loot, exploredLocations: { ...save.exploredLocations, [name]: (save.exploredLocations[name] ?? 0) + 1 } }, 15, 10));
        result.setText(`${name}を探索
新しい発見！ 戦利品 +${loot} · XP+15`);
        const find = this.add.text(x, y - 20, `✦ +${loot}`, { fontSize: '20px', fontStyle: 'bold', color: '#ffe07c' }).setOrigin(0.5);
        this.tweens.add({ targets: find, y: y - 95, alpha: 0, duration: 900, onComplete: () => find.destroy() });
      });
    });
  }
}
