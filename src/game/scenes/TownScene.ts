import Phaser from 'phaser';
import { loadSave } from '../../save/SaveRepository';

export class TownScene extends Phaser.Scene {
  constructor() { super('TownScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#17352e');
    this.add.text(24, 24, 'LIFE QUEST', { fontSize: '28px', fontStyle: 'bold', color: '#ffe9a8' });
    this.add.text(24, 62, '開拓都市・プロトタイプ', { fontSize: '13px', color: '#c5d6cc' });

    const facilities = [
      ['鉱山', 'MineScene', 95, 245, 0x6d665e],
      ['釣り', 'FishingScene', 292, 245, 0x3d7190],
      ['工房', 'WorkshopScene', 100, 405, 0x8a5b34],
      ['探索', 'ExploreScene', 290, 405, 0x526c3f]
    ] as const;

    facilities.forEach(([name, scene, x, y, color]) => {
      const box = this.add.rectangle(x, y, 135, 105, color).setStrokeStyle(3, 0xd8b76d).setInteractive({ useHandCursor: true });
      this.add.text(x, y, name, { fontSize: '22px', fontStyle: 'bold', color: '#fff5ce' }).setOrigin(0.5);
      box.on('pointerup', () => this.scene.start(scene));
    });

    const save = loadSave();
    this.add.text(24, 540, `地下 B${save.depth}F   石 ${save.stone}   鉱石 ${save.iron}\nインゴット ${save.ingots}   魚 ${save.fishCaught}   ギア ${save.gears}\n発見 ${save.discoveries}   戦利品 ${save.loot}`, {
      fontSize: '15px',
      color: '#eff7ed',
      lineSpacing: 8
    });
  }
}
