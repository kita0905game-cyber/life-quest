import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';

type Hotspot = {
  label: string;
  icon: string;
  scene: string;
  x: number;
  y: number;
  color: number;
  active?: boolean;
};

function remainingMinutes(iso: string) {
  const end = Date.parse(iso);
  if (!Number.isFinite(end)) return 0;
  return Math.max(0, Math.ceil((end - Date.now()) / 60_000));
}

export class TownScene extends Phaser.Scene {
  constructor() { super('TownScene'); }

  preload() {
    this.load.image('town-v2', './assets/town-v2.png');
  }

  create() {
    const save = loadSave();
    const now = new Date();
    const season = ['冬', '冬', '春', '春', '春', '夏', '夏', '夏', '秋', '秋', '秋', '冬'][now.getMonth()];
    const hour = now.getHours();
    const time = hour >= 5 && hour < 10 ? '朝' : hour < 17 ? '昼' : hour < 20 ? '夕方' : '夜';
    const dev = save.mineLevel + save.workshopLevel;
    const rank = dev >= 6 ? '工業都市' : dev >= 4 ? '開拓町' : Math.max(save.mineLevel, save.workshopLevel) >= 4 ? '村' : '開拓地';

    const minerMinutes = remainingMinutes(save.minerHiredUntil);
    const minerActive = minerMinutes > 0;
    const wagonCount = save.wagonTransfers.length;
    const trainCount = save.railwayTrainCount;

    this.add.image(195, 340, 'town-v2').setDisplaySize(510, 680);

    // Header overlay: keep the town as the visual focus while making current state readable.
    this.add.rectangle(195, 58, 390, 116, 0x071411, 0.82);
    this.add.rectangle(195, 113, 390, 4, 0xd5b75f, 0.24);

    this.add.text(16, 10, `${rank}・黄昏都市`, {
      fontSize: '21px',
      fontStyle: 'bold',
      color: '#ffe6a3'
    });
    this.add.text(17, 39, `${season}・${time}　施設を直接タップ`, {
      fontSize: '11px',
      color: '#c9d9ce'
    });

    const treasure = this.add.text(366, 18, `🎁 ${save.chests}`, {
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ffe29a',
      backgroundColor: '#163129dd',
      padding: { x: 7, y: 5 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    treasure.on('pointerup', () => {
      const current = loadSave();
      if (current.chests < 1) {
        treasure.setText('🎁 空');
        this.time.delayedCall(1200, () => treasure.setText(`🎁 ${loadSave().chests}`));
        return;
      }

      const gold = Phaser.Math.Between(45, 100);
      const wood = Phaser.Math.Between(2, 5);
      const stone = Phaser.Math.Between(2, 5);
      updateSave((value) => ({
        ...value,
        chests: value.chests - 1,
        chestsOpened: value.chestsOpened + 1,
        gold: value.gold + gold,
        wood: value.wood + wood,
        stone: value.stone + stone,
        bait: value.bait + 1 + (Math.random() < .35 ? 1 : 0),
        iron: value.iron + (Math.random() < .55 ? 1 : 0),
        copper: value.copper + (Math.random() < .4 ? 1 : 0),
        crystal: value.crystal + (Math.random() < .08 ? 1 : 0),
        explorationTickets: value.explorationTickets + (Math.random() < .1 ? 1 : 0)
      }));
      treasure.setText(`+${gold}G 石+${stone}`);
      this.time.delayedCall(1500, () => treasure.setText(`🎁 ${loadSave().chests}`));
    });

    const liveItems = [
      {
        x: 70,
        title: minerActive ? '鉱夫 稼働中' : '鉱夫 待機',
        detail: minerActive ? `あと約${minerMinutes}分` : '山岳鉱山',
        scene: 'MineScene',
        active: minerActive
      },
      {
        x: 195,
        title: trainCount > 0 ? `列車 ${trainCount}編成` : '列車 未製造',
        detail: trainCount > 0 ? '鉄道へ' : '鉄鉱石100で製造',
        scene: 'RailwayScene',
        active: trainCount > 0
      },
      {
        x: 320,
        title: wagonCount > 0 ? `馬車輸送 ${wagonCount}便` : '輸送 待機',
        detail: wagonCount > 0 ? '地域間を輸送中' : '山岳→拠点',
        scene: 'RailwayScene',
        active: wagonCount > 0
      }
    ];

    liveItems.forEach((item) => {
      const box = this.add.rectangle(item.x, 84, 116, 39, 0x0b211c, 0.9)
        .setStrokeStyle(1, item.active ? 0xe1c264 : 0x607a6d, item.active ? 0.85 : 0.5)
        .setInteractive({ useHandCursor: true });
      this.add.text(item.x - 48, 72, item.title, {
        fontSize: '9px',
        fontStyle: 'bold',
        color: item.active ? '#ffe7a2' : '#d6e1db'
      });
      this.add.text(item.x - 48, 87, item.detail, {
        fontSize: '8px',
        color: '#9fb2a8'
      });
      this.add.text(item.x + 48, 80, '›', {
        fontSize: '17px',
        color: '#e6d49c'
      }).setOrigin(0.5);
      box.on('pointerup', () => this.scene.start(item.scene));
    });

    const hotspots: Hotspot[] = [
      { label: '探索', icon: '✦', scene: 'ExploreScene', x: 58, y: 166, color: 0x2f7253 },
      { label: '鉱山', icon: '⛏', scene: 'MineScene', x: 195, y: 196, color: 0x6a5c50, active: minerActive },
      { label: 'BOSS', icon: '♜', scene: 'BossScene', x: 325, y: 156, color: 0x6d3445 },
      { label: '鉄道', icon: '▰', scene: 'RailwayScene', x: 326, y: 274, color: 0x405d55, active: trainCount > 0 || wagonCount > 0 },
      { label: '図鑑', icon: '▦', scene: 'MuseumScene', x: 68, y: 350, color: 0x316874 },
      { label: 'ギルド', icon: '⚑', scene: 'GuildScene', x: 197, y: 348, color: 0x3e536f },
      { label: '工房', icon: '⚒', scene: 'WorkshopScene', x: 320, y: 390, color: 0x8b4a2d },
      { label: '家', icon: '⌂', scene: 'HouseScene', x: 74, y: 500, color: 0x6d543b },
      { label: '記録', icon: '☰', scene: 'RecordsScene', x: 330, y: 505, color: 0x384f68 },
      { label: '釣り', icon: '◜', scene: 'FishingScene', x: 205, y: 575, color: 0x256b85 }
    ];

    hotspots.forEach(({ label, icon, scene, x, y, color, active }) => {
      this.add.circle(x + 2, y + 4, 39, 0x000000, 0.25);
      const halo = this.add.circle(x, y, 36, color, 0.94)
        .setStrokeStyle(2.5, 0xf0cf78, 0.95)
        .setInteractive({ useHandCursor: true });

      this.add.circle(x, y, 31, 0xffffff, 0.025).setStrokeStyle(1, 0xffe7a2, 0.2);
      this.add.text(x, y - 7, icon, {
        fontSize: '23px',
        color: '#fff2bd'
      }).setOrigin(0.5);
      this.add.text(x, y + 24, label, {
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#fff7d7',
        backgroundColor: '#081411dd',
        padding: { x: 7, y: 3 }
      }).setOrigin(0.5);

      if (active) {
        this.add.circle(x + 27, y - 27, 4.5, 0xe55d54, 1)
          .setStrokeStyle(1.5, 0xffd7a6, 0.9);
      }

      halo.on('pointerdown', () => halo.setAlpha(0.72));
      halo.on('pointerout', () => halo.setAlpha(1));
      halo.on('pointerup', () => {
        halo.setAlpha(1);
        this.scene.start(scene);
      });
    });
  }
}
