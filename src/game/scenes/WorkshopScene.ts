import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';

export class WorkshopScene extends Phaser.Scene {
  constructor() { super('WorkshopScene'); }

  preload() { this.load.image('workshop-bg-v1', './assets/workshop-v1.png'); }

  create() {
    this.cameras.main.setBackgroundColor('#30251f');
    this.add.image(195, 340, 'workshop-bg-v1').setDisplaySize(510, 680);
    this.add.rectangle(195, 340, 390, 680, 0x1b1009, 0.15);
    addBackButton(this);
    addTitle(this, '工房', '設備を直接使って加工する');

    const furnace = this.add.rectangle(105, 300, 145, 190, 0x3d2118, 0.45).setStrokeStyle(4, 0xf0ad55).setInteractive({ useHandCursor: true });
    const flame = this.add.circle(105, 320, 40, 0xef7f38, 0.72);
    this.tweens.add({ targets: flame, scaleX: 0.78, scaleY: 1.18, alpha: 0.95, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.add.text(105, 225, '炉', { fontSize: '24px', color: '#fff0bc' }).setOrigin(0.5);

    const bench = this.add.rectangle(285, 325, 150, 105, 0x4d3925, 0.55).setStrokeStyle(4, 0xd4ae64).setInteractive({ useHandCursor: true });
    this.add.text(285, 325, '作業台', { fontSize: '22px', color: '#fff0bc' }).setOrigin(0.5);

    const status = this.add.text(195, 500, '炉：鉄鉱石3 → 鉄インゴット1\n作業台：鉄2＋銅1 → 歯車1', { fontSize: '15px', color: '#f2e7cf', align: 'center' }).setOrigin(0.5);
    const upgrade=this.add.text(195,590,'工房を強化',{fontSize:'16px',color:'#fff0b5',backgroundColor:'#69462f',padding:{x:16,y:9}}).setOrigin(.5).setInteractive({useHandCursor:true});
    upgrade.on('pointerup',()=>{const s=loadSave();if(s.workshopLevel>=3){status.setText('工房 Lv.3 MAX');return;}const ok=s.workshopLevel===1?s.gold>=220&&s.wood>=8&&s.ingots>=2&&s.copperIngots>=2:s.gold>=450&&s.wood>=12&&s.gears>=3&&s.lanterns>=1;if(!ok){status.setText('強化に必要なG・素材が足りない');return;}updateSave(v=>v.workshopLevel===1?{...v,workshopLevel:2,gold:v.gold-220,wood:v.wood-8,ingots:v.ingots-2,copperIngots:v.copperIngots-2}:{...v,workshopLevel:3,gold:v.gold-450,wood:v.wood-12,gears:v.gears-3,lanterns:v.lanterns-1});status.setText(`工房 Lv.${loadSave().workshopLevel}！`);});

    furnace.on('pointerup', () => {
      const save = loadSave();
      if (save.iron < 3) {
        status.setText(`精錬には鉄鉱石3個必要 / 現在 ${save.iron}`);
        return;
      }
      updateSave((current) => ({ ...current, iron: current.iron - 3, ingots: current.ingots + 1, crafted: current.crafted + 1, discoveredItems: [...new Set([...current.discoveredItems, 'ingots'])] }));
      status.setText('鉄インゴットを1個精錬した！');
      this.cameras.main.flash(180, 255, 136, 45, false);
    });
    bench.on('pointerup', () => {
      const save = loadSave();
      if (save.ingots < 2 || save.copperIngots < 1) {
        if (save.copper >= 3 && save.copperIngots < 1) {
          updateSave((s) => ({ ...s, copper: s.copper - 3, copperIngots: s.copperIngots + 1, crafted: s.crafted + 1, discoveredItems: [...new Set([...s.discoveredItems, 'copperIngots'])] }));
          status.setText('銅インゴットを1個精錬した！ もう一度作業台を押そう');
          return;
        }
        status.setText(`歯車：鉄インゴット2・銅インゴット1が必要`);
        return;
      }
      updateSave((current) => ({ ...current, ingots: current.ingots - 2, copperIngots: current.copperIngots - 1, gears: current.gears + 1, crafted: current.crafted + 1, discoveredItems: [...new Set([...current.discoveredItems, 'gears'])] }));
      status.setText('ギアを1個製作した！');
      this.tweens.add({ targets: bench, scaleY: 0.92, duration: 90, yoyo: true, repeat: 2 });
    });
  }
}
