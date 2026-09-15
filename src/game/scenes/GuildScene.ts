import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { reward } from '../systems/progression';
import { addBackButton, addTitle } from './ui';

export class GuildScene extends Phaser.Scene {
  constructor() { super('GuildScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#1c302e');
    addBackButton(this);
    addTitle(this, '開拓者ギルド', '違う遊びを巡るほど街が育つ');
    const panel = this.add.rectangle(195, 355, 350, 455, 0x132522).setStrokeStyle(3, 0xcfb468);
    const progressText = this.add.text(195, 245, '', { fontSize: '16px', color: '#eef3d9', align: 'left', lineSpacing: 13 }).setOrigin(0.5);
    const result = this.add.text(195, 445, '', { fontSize: '15px', color: '#ffe39a', align: 'center' }).setOrigin(0.5);
    const claim = this.add.text(195, 520, '報酬を受け取る', { fontSize: '19px', fontStyle: 'bold', color: '#fff0b5', backgroundColor: '#547044', padding: { x: 22, y: 12 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const refresh = () => {
      const save = loadSave();
      const mining = Math.min(2, save.rocksBroken);
      const fishing = Math.min(1, save.fishCaught);
      const exploring = Math.min(1, save.discoveries);
      const crafting = Math.min(1, save.crafted);
      const total = mining + fishing + exploring + crafting;
      progressText.setText(`⛏ 岩盤を2個破壊　${mining}/2\n◜ 魚を1匹釣る　　${fishing}/1\n✦ 1回探索する　　 ${exploring}/1\n⚒ 1個加工する　　 ${crafting}/1\n\n開拓進行　${total}/5`);
      result.setText(save.guildRewardClaimed ? '本日の開拓報酬は受取済み' : total >= 5 ? '達成！ 80XP・200G・ギア1個' : '街を巡って依頼を進めよう');
      claim.setAlpha(total >= 5 && !save.guildRewardClaimed ? 1 : 0.42);
      panel.setStrokeStyle(3, total >= 5 ? 0xffdf74 : 0xcfb468);
    };
    claim.on('pointerup', () => {
      const save = loadSave();
      const total = Math.min(2, save.rocksBroken) + Math.min(1, save.fishCaught) + Math.min(1, save.discoveries) + Math.min(1, save.crafted);
      if (total < 5 || save.guildRewardClaimed) return;
      updateSave((s) => reward({ ...s, guildRewardClaimed: true, gears: s.gears + 1 }, 80, 200));
      this.cameras.main.flash(350, 255, 223, 116);
      refresh();
    });
    refresh();
  }
}
