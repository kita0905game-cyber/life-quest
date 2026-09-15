import Phaser from 'phaser';
import { loadSave } from '../../save/SaveRepository';
import { fishCatalog } from '../data/gameData';
import { addBackButton, addTitle } from './ui';

export class MuseumScene extends Phaser.Scene {
  constructor() { super('MuseumScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#17333a');
    addBackButton(this);
    addTitle(this, '博物館・図鑑', '集めた記録が街の歴史になる');
    const save = loadSave();
    this.add.rectangle(195, 350, 350, 455, 0x10252a).setStrokeStyle(3, 0xc7a968);
    this.add.text(195, 160, `収集達成度 ${Object.keys(save.fishRecords).length + (save.iron > 0 ? 1 : 0) + (save.loot > 0 ? 1 : 0)} / 6`, { fontSize: '18px', color: '#ffe7a3' }).setOrigin(0.5);

    fishCatalog.forEach((fish, index) => {
      const size = save.fishRecords[fish];
      const y = 220 + index * 52;
      this.add.circle(75, y, 18, size ? 0x397b8c : 0x26363a).setStrokeStyle(2, size ? 0xe1c36f : 0x536064);
      this.add.text(108, y, size ? `${fish}　自己最大 ${size}cm` : '？？？　未発見', { fontSize: '15px', color: size ? '#eef5dc' : '#718186' }).setOrigin(0, 0.5);
    });
    this.add.text(195, 470, `鉱物標本　${save.iron + save.ingots > 0 ? '登録済み' : '未発見'}\n遺跡資料　${save.loot > 0 ? `${save.loot}点収蔵` : '未発見'}`, { fontSize: '15px', color: '#d8e4d4', align: 'center', lineSpacing: 10 }).setOrigin(0.5);
  }
}
