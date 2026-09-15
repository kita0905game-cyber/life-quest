import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { reward } from '../systems/progression';
import { addBackButton, addTitle } from './ui';

export class BossScene extends Phaser.Scene {
  constructor() { super('BossScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#251a2e');
    addBackButton(this);
    addTitle(this, '黄昏城', '日々の冒険で城主へ挑む');
    const save = loadSave();
    const boss = this.add.circle(195, 330, 115, 0x542a42).setStrokeStyle(7, 0xb7805c);
    this.add.text(195, 300, '♜', { fontSize: '82px', color: '#f1c982' }).setOrigin(0.5);
    const hp = this.add.text(195, 430, '', { fontSize: '17px', color: '#ffe8c2' }).setOrigin(0.5);
    const message = this.add.text(195, 505, 'ギア1個で城門を破壊', { fontSize: '15px', color: '#d7c9dd' }).setOrigin(0.5);
    const attack = this.add.text(195, 560, '⚙ ギア攻撃', { fontSize: '20px', fontStyle: 'bold', color: '#fff0b0', backgroundColor: '#713c49', padding: { x: 22, y: 12 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const refresh = () => { const s=loadSave(); hp.setText(`BOSS HP ${s.bossHp} / ${s.bossMax}`); };
    refresh();
    attack.on('pointerup', () => {
      const current = loadSave();
      if (current.gears < 1) { message.setText('工房でギアを作ろう'); return; }
      const damage = 35;
      const nextHp = Math.max(0, current.bossHp - damage);
      updateSave((s) => reward({ ...s, gears: s.gears - 1, bossHp: nextHp }, 25, 40));
      this.cameras.main.shake(180, 0.015);
      boss.setFillStyle(0x7a3647);
      this.time.delayedCall(180, () => boss.setFillStyle(0x542a42));
      message.setText(nextHp === 0 ? '城門突破！ 300G獲得' : `${damage}ダメージ！ XP+25 / 40G`);
      if (nextHp === 0) updateSave((s) => ({ ...s, gold: s.gold + 300 }));
      refresh();
    });
  }
}
