import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';

export class HouseScene extends Phaser.Scene {
  constructor() { super('HouseScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#302a22');
    addBackButton(this);
    addTitle(this, 'マイハウス', '休んでも損をしない冒険拠点');
    this.add.rectangle(195, 350, 340, 430, 0x40372b).setStrokeStyle(4, 0xbfa26a);
    this.add.rectangle(195, 300, 230, 135, 0x6c5139).setStrokeStyle(3, 0xe2c88e);
    this.add.circle(120, 285, 22, 0xf3b35a, 0.9);
    this.add.text(195, 205, '🔥  静かな夜の休息', { fontSize: '22px', color: '#ffe6a8' }).setOrigin(0.5);
    const status = this.add.text(195, 410, `採掘力 ${loadSave().energy}（休息で最低12まで回復）`, { fontSize: '17px', color: '#f2e4c4' }).setOrigin(0.5);
    const rest = this.add.text(195, 495, 'ひと休みする', { fontSize: '20px', fontStyle: 'bold', color: '#fff1bd', backgroundColor: '#526044', padding: { x: 25, y: 13 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    rest.on('pointerup', () => {
      const current = loadSave();
      const recovered = Math.max(current.energy, 12);
      updateSave((save) => ({ ...save, energy: Math.max(save.energy, 12) }));
      status.setText(`採掘力 ${recovered}　回復した！`);
      this.cameras.main.fadeIn(500, 20, 12, 6);
    });
  }
}
