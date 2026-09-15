import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';

type Hotspot = { label: string; icon: string; scene: string; x: number; y: number; color: number };

export class TownScene extends Phaser.Scene {
  constructor() { super('TownScene'); }

  preload() { this.load.image('town-v2', './assets/town-v2.png'); }

  create() {
    this.add.image(195, 340, 'town-v2').setDisplaySize(510, 680);
    this.add.rectangle(195, 34, 390, 68, 0x071411, 0.82);
    const now=new Date(); const season=['冬','冬','春','春','春','夏','夏','夏','秋','秋','秋','冬'][now.getMonth()]; const h=now.getHours(); const time=h>=5&&h<10?'朝':h<17?'昼':h<20?'夕方':'夜';
    const current=loadSave(); const dev=current.mineLevel+current.workshopLevel; const rank=dev>=6?'工業都市':dev>=4?'開拓町':Math.max(current.mineLevel,current.workshopLevel)>=4?'村':'開拓地';
    this.add.text(18, 11, `${rank}・黄昏都市`, { fontSize: '22px', fontStyle: 'bold', color: '#ffe6a3' });
    this.add.text(19, 40, `${season}・${time}　施設を直接タップ`, { fontSize: '12px', color: '#c9d9ce' });

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
    const treasure=this.add.text(195, 615, `🎁 宝箱 ${save.chests}　タップで開ける`, {fontSize:'14px',fontStyle:'bold',color:'#ffe29a',backgroundColor:'#263c32dd',padding:{x:10,y:6}}).setOrigin(.5).setInteractive({useHandCursor:true});
    treasure.on('pointerup',()=>{ const s=loadSave(); if(s.chests<1){treasure.setText('宝箱は空だ');return;} const gold=Phaser.Math.Between(45,100),wood=Phaser.Math.Between(2,5),stone=Phaser.Math.Between(2,5); updateSave(v=>({...v,chests:v.chests-1,chestsOpened:v.chestsOpened+1,gold:v.gold+gold,wood:v.wood+wood,stone:v.stone+stone,bait:v.bait+1+(Math.random()<.35?1:0),iron:v.iron+(Math.random()<.55?1:0),copper:v.copper+(Math.random()<.4?1:0),crystal:v.crystal+(Math.random()<.08?1:0),explorationTickets:v.explorationTickets+(Math.random()<.1?1:0)})); treasure.setText(`+${gold}G 木材+${wood} 石材+${stone}`); });
    this.add.text(195, 658, `石${save.stone} 鉄${save.iron} 銅${save.copper} 木${save.wood} ✦${save.crystal}　魚${save.fishCaught}`, { fontSize: '11px', color: '#f5e8bd' }).setOrigin(0.5);
  }
}
