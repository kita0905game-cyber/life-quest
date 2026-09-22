import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { TOWN_ART_URL, addCoverImage, addPlaque } from '../assets/legacyUi';

type Hotspot = {
  label: string;
  scene: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function remainingMinutes(iso: string) {
  const end = Date.parse(iso);
  if (!Number.isFinite(end)) return 0;
  return Math.max(0, Math.ceil((end - Date.now()) / 60_000));
}

export class TownScene extends Phaser.Scene {
  constructor() { super('TownScene'); }

  preload() {
    this.load.image('town-appdeploy', TOWN_ART_URL);
    this.load.image('town-fallback', './assets/town-v2.png');
  }

  create() {
    const save = loadSave();
    const now = new Date();
    const season = ['冬', '冬', '春', '春', '春', '夏', '夏', '夏', '秋', '秋', '秋', '冬'][now.getMonth()];
    const hour = now.getHours();
    const daypart = hour >= 5 && hour < 10 ? '朝' : hour < 17 ? '昼' : hour < 20 ? '夕方' : '夜';
    const dev = save.mineLevel + save.workshopLevel;
    const rank = dev >= 6 ? '工業都市' : dev >= 4 ? '開拓町' : '開拓地';

    const artKey = this.textures.exists('town-appdeploy') ? 'town-appdeploy' : 'town-fallback';
    addCoverImage(this, artKey);

    // AppDeploy版と同じく、街の絵そのものを主役にする。
    this.add.rectangle(195, 40, 390, 80, 0x071611, 0.46).setDepth(8);
    this.add.rectangle(195, 655, 390, 50, 0x071712, 0.58).setDepth(8);

    this.add.text(15, 13, '✦ LIFE QUEST', {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '10px',
      color: '#d7bd7a'
    }).setDepth(20);

    this.add.text(15, 31, `${rank}・${season} / ${daypart}`, {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '18px',
      color: '#f3e5be'
    }).setDepth(20);

    this.add.text(15, 55, '建物を直接タップ', {
      fontSize: '9px',
      color: '#aebcae'
    }).setDepth(20);

    const minerMinutes = remainingMinutes(save.minerHiredUntil);
    const statusText = [
      minerMinutes > 0 ? `鉱夫 ${minerMinutes}分` : '',
      save.railwayTrainCount > 0 ? `列車 ${save.railwayTrainCount}編成` : '',
      save.wagonTransfers.length > 0 ? `輸送 ${save.wagonTransfers.length}便` : ''
    ].filter(Boolean).join(' · ');

    if (statusText) {
      this.add.text(375, 55, statusText, {
        fontSize: '8px',
        color: '#d9c99f',
        align: 'right'
      }).setOrigin(1, 0).setDepth(20);
    }

    const hotspots: Hotspot[] = [
      { label: 'BOSS城', scene: 'BossScene', x: 0.84, y: 0.08, width: 82, height: 62 },
      { label: '博物館', scene: 'MuseumScene', x: 0.14, y: 0.19, width: 88, height: 76 },
      { label: '探索ギルド', scene: 'ExploreScene', x: 0.46, y: 0.27, width: 100, height: 82 },
      { label: 'マイハウス', scene: 'HouseScene', x: 0.73, y: 0.37, width: 98, height: 82 },
      { label: '鉱山', scene: 'MineScene', x: 0.86, y: 0.55, width: 88, height: 92 },
      { label: '広場', scene: 'GuildScene', x: 0.48, y: 0.49, width: 92, height: 70 },
      { label: '工房', scene: 'WorkshopScene', x: 0.49, y: 0.64, width: 96, height: 84 },
      { label: '釣り場', scene: 'FishingScene', x: 0.18, y: 0.70, width: 98, height: 90 },
      { label: '中央駅', scene: 'RailwayScene', x: 0.82, y: 0.78, width: 105, height: 88 }
    ];

    hotspots.forEach((spot) => {
      const x = spot.x * 390;
      const y = spot.y * 680;
      const hit = this.add.zone(x, y, spot.width, spot.height)
        .setDepth(15)
        .setInteractive({ useHandCursor: true });
      const plaque = addPlaque(this, x, y + spot.height * 0.34, spot.label).setAlpha(0.82);

      hit.on('pointerover', () => plaque.setAlpha(1).setScale(1.04));
      hit.on('pointerout', () => plaque.setAlpha(0.82).setScale(1));
      hit.on('pointerdown', () => plaque.setScale(0.97));
      hit.on('pointerup', () => {
        plaque.setScale(1);
        this.scene.start(spot.scene);
      });
    });

    const treasure = addPlaque(this, 340, 24, `宝箱 ×${save.chests}`)
      .setOrigin(0.5)
      .setDepth(30)
      .setInteractive({ useHandCursor: true });

    treasure.on('pointerup', () => {
      const current = loadSave();
      if (current.chests < 1) {
        treasure.setText('宝箱は空');
        this.time.delayedCall(1000, () => treasure.setText(`宝箱 ×${loadSave().chests}`));
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
      treasure.setText(`+${gold}G · 石材+${stone}`);
      this.time.delayedCall(1200, () => treasure.setText(`宝箱 ×${loadSave().chests}`));
    });

    const records = addPlaque(this, 342, 642, '記録')
      .setDepth(30)
      .setInteractive({ useHandCursor: true });
    records.on('pointerup', () => this.scene.start('RecordsScene'));
  }
}
