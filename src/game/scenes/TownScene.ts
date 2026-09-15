import Phaser from 'phaser';
import { loadSave } from '../../save/SaveRepository';

type Hotspot = { label: string; icon: string; scene: string; x: number; y: number; color: number };

export class TownScene extends Phaser.Scene {
  constructor() { super('TownScene'); }

  preload() { this.load.image('town', './assets/town.png'); }

  create() {
    this.add.image(195, 340, 'town').setDisplaySize(510, 680);
    this.add.rectangle(195, 34, 390, 68, 0x071411, 0.82);
    this.add.text(18, 11, '黄昏の開拓都市', { fontSize: '22px', fontStyle: 'bold', color: '#ffe6a3' });
    this.add.text(19, 40, '秋・夕暮れ　施設を直接タップ', { fontSize: '12px', color: '#c9d9ce' });

    const hotspots: Hotspot[] = [
      { label: '探索', icon: '✦', scene: 'ExploreScene', x: 58, y: 120, color: 0x2f7253 },
      { label: '鉱山', icon: '⛏', scene: 'MineScene', x: 195, y: 154, color: 0x6a5c50 },
      { label: 'BOSS', icon: '♜', scene: 'BossScene', x: 325, y: 105, color: 0x6d3445 },
      { label: '図鑑', icon: '▦', scene: 'MuseumScene', x: 68, y: 320, color: 0x316874 },
      { label: 'ギルド', icon: '⚑', scene: 'GuildScene', x: 197, y: 315, color: 0x3e536f },
      { label: '工房', icon: '⚒', scene: 'WorkshopScene', x: 320, y: 360, color: 0x8b4a2d },
      { label: '記録', icon: '☰', scene: 'RecordsScene', x: 330, y: 490, color: 0x384f68 },
      { label: '家', icon: '⌂', scene: 'HouseScene', x: 75, y: 485, color: 0x6d543b },
      { label: '釣り', icon: '◜', scene: 'FishingScene', x: 205, y: 570, color: 0x256b85 }
    ];

    hotspots.forEach(({ label, icon, scene, x, y, color }) => {
      const halo = this.add.circle(x, y, 34, color, 0.9).setStrokeStyle(3, 0xf0cf78).setInteractive({ useHandCursor: true });
      this.add.text(x, y - 6, icon, { fontSize: '23px', color: '#fff2bd' }).setOrigin(0.5);
      this.add.text(x, y + 24, label, { fontSize: '12px', fontStyle: 'bold', color: '#fff7d7', backgroundColor: '#0b1715cc', padding: { x: 6, y: 3 } }).setOrigin(0.5);
      this.tweens.add({ targets: halo, scale: 1.06, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      halo.on('pointerup', () => this.scene.start(scene));
    });

    const save = loadSave();
    this.add.rectangle(195, 648, 370, 45, 0x081411, 0.88).setStrokeStyle(1, 0xc8a65b);
    this.add.text(195, 648, `鉱石 ${save.iron}　インゴット ${save.ingots}　魚 ${save.fishCaught}　戦利品 ${save.loot}`, { fontSize: '12px', color: '#f5e8bd' }).setOrigin(0.5);
  }
}
