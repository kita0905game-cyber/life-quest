import Phaser from 'phaser';
import { loadSave } from '../../save/SaveRepository';
import { getLevel } from '../systems/progression';
import { addBackButton, addTitle } from './ui';

export class RecordsScene extends Phaser.Scene {
  constructor() { super('RecordsScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#182837');
    addBackButton(this);
    addTitle(this, '冒険記録', '積み重ねた行動を振り返る');
    const save = loadSave();
    const progress = getLevel(save);
    const rows = [
      ['冒険者レベル', `Lv.${progress.level}`], ['累計EXP', `${save.xp}`], ['到達深度', `B${save.depth}F`],
      ['岩盤破壊', `${save.rocksBroken}回`], ['釣果', `${save.fishCaught}匹`], ['探索発見', `${save.discoveries}件`],
      ['製作品', `${save.crafted}個`], ['所持金', `${save.gold}G`]
    ];
    rows.forEach(([label, value], index) => {
      const y = 165 + index * 53;
      this.add.rectangle(195, y, 335, 42, index % 2 ? 0x203547 : 0x1d3040, 0.9).setStrokeStyle(1, 0x49677a);
      this.add.text(44, y, label, { fontSize: '14px', color: '#a9c2cf' }).setOrigin(0, 0.5);
      this.add.text(345, y, value, { fontSize: '17px', fontStyle: 'bold', color: '#ffe2a0' }).setOrigin(1, 0.5);
    });
  }
}
