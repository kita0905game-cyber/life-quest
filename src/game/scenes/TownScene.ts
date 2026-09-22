import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';

type Hotspot = {
  label: string;
  scene?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  primary?: boolean;
  locked?: boolean;
  message?: string;
};

function seasonAndDaypart(date: Date) {
  const season = ['冬', '冬', '春', '春', '春', '夏', '夏', '夏', '秋', '秋', '秋', '冬'][date.getMonth()];
  const hour = date.getHours();
  const daypart = hour >= 5 && hour < 10 ? '朝' : hour < 17 ? '昼' : hour < 20 ? '夕方' : '夜';
  return { season, daypart };
}

function townRank() {
  const save = loadSave();
  const development = save.mineLevel + save.workshopLevel;
  if (development >= 6) return '工業都市';
  if (development >= 4) return '開拓町';
  if (Math.max(save.mineLevel, save.workshopLevel) >= 2) return '村';
  return '開拓地';
}

export class TownScene extends Phaser.Scene {
  constructor() { super('TownScene'); }

  preload() {
    this.load.svg('town-clean-v3', './assets/town-clean-v3.svg');
  }

  create() {
    const save = loadSave();
    const { season, daypart } = seasonAndDaypart(new Date());

    this.cameras.main.setBackgroundColor('#0d211a');

    // Background-only art. No HUD, labels, buttons or text are baked into the SVG.
    this.add.image(195, 340, 'town-clean-v3')
      .setDisplaySize(390, 680)
      .setDepth(0);

    // Gentle readability veil only; the town remains the main visual.
    this.add.rectangle(195, 45, 390, 90, 0x06120e, 0.34).setDepth(5);

    this.add.text(16, 14, townRank(), {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '17px',
      color: '#eadfc0'
    }).setDepth(20);

    this.add.text(16, 39, `${season} · ${daypart}　メイン開発街`, {
      fontSize: '9px',
      color: '#aeb5a0'
    }).setDepth(20);

    const hotspots: Hotspot[] = [
      // Primary direct-tap facilities requested for the new composition.
      { label: '鉱山', scene: 'MineScene', x: 88, y: 250, width: 132, height: 126, primary: true },
      { label: '釣り場', scene: 'FishingScene', x: 300, y: 252, width: 132, height: 126, primary: true },
      { label: '工房', scene: 'WorkshopScene', x: 92, y: 520, width: 132, height: 132, primary: true },
      { label: '探索ギルド', scene: 'ExploreScene', x: 302, y: 520, width: 138, height: 132, primary: true },

      // Existing town destinations are preserved; only their visual treatment is quieter.
      { label: 'BOSS城', scene: 'BossScene', x: 197, y: 142, width: 88, height: 62 },
      { label: '博物館', scene: 'MuseumScene', x: 160, y: 330, width: 82, height: 68 },
      { label: '中央広場', scene: 'GuildScene', x: 195, y: 403, width: 88, height: 68 },
      { label: 'マイハウス', scene: 'HouseScene', x: 242, y: 346, width: 84, height: 72 },
      { label: '図書館', x: 92, y: 382, width: 78, height: 66, locked: true, message: '図書館は学習UIとの再接続候補。街の場所として残しています。' },
      { label: '記録', scene: 'RecordsScene', x: 90, y: 620, width: 82, height: 66 },
      { label: '中央駅', scene: 'RailwayScene', x: 300, y: 620, width: 96, height: 66 }
    ];

    hotspots.forEach((spot) => this.addHotspot(spot));

    this.addTreasure(save.chests);
  }

  private addHotspot(spot: Hotspot) {
    const hit = this.add.zone(spot.x, spot.y, spot.width, spot.height)
      .setDepth(12)
      .setInteractive({ useHandCursor: true });

    const focus = this.add.rectangle(
      spot.x,
      spot.y,
      spot.width - 6,
      spot.height - 6,
      0x000000,
      0
    )
      .setStrokeStyle(spot.primary ? 2 : 1, 0xd8bd77, 0)
      .setDepth(10);

    const label = this.add.text(
      spot.x,
      spot.y + spot.height * 0.36,
      spot.label,
      {
        fontFamily: 'Georgia, "Noto Serif JP", serif',
        fontSize: spot.primary ? '10px' : '8px',
        color: spot.locked ? '#b9bcaa' : '#f1e5c3',
        backgroundColor: spot.locked ? '#26372fdf' : '#173229df',
        padding: { x: spot.primary ? 10 : 7, y: spot.primary ? 6 : 4 },
        stroke: '#57482e',
        strokeThickness: 1
      }
    )
      .setOrigin(.5)
      .setDepth(15)
      .setAlpha(spot.primary ? .95 : .82);

    const react = (active: boolean) => {
      label.setAlpha(active ? 1 : (spot.primary ? .95 : .82));
      label.setScale(active ? 1.04 : 1);
      focus.setStrokeStyle(spot.primary ? 2 : 1, 0xd8bd77, active ? .72 : 0);
    };

    hit.on('pointerover', () => react(true));
    hit.on('pointerout', () => react(false));
    hit.on('pointerdown', () => react(true));
    hit.on('pointerup', () => {
      react(false);
      if (spot.scene) {
        this.scene.start(spot.scene);
        return;
      }
      if (spot.message) this.flashMessage(spot.message);
    });
  }

  private addTreasure(initialCount: number) {
    const treasure = this.add.text(374, 16, `宝箱 ×${initialCount}`, {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '9px',
      color: '#efdcae',
      backgroundColor: '#173229df',
      padding: { x: 8, y: 5 },
      stroke: '#57482e',
      strokeThickness: 1
    })
      .setOrigin(1, 0)
      .setDepth(30)
      .setInteractive({ useHandCursor: true });

    treasure.on('pointerup', () => {
      const current = loadSave();
      if (current.chests < 1) {
        treasure.setText('宝箱は空');
        this.time.delayedCall(900, () => treasure.setText(`宝箱 ×${loadSave().chests}`));
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
  }

  private flashMessage(message: string) {
    const box = this.add.text(195, 610, message, {
      fontSize: '9px',
      color: '#f0e4c6',
      align: 'center',
      backgroundColor: '#142d24eb',
      padding: { x: 12, y: 8 },
      wordWrap: { width: 285 }
    }).setOrigin(.5).setDepth(40);

    this.time.delayedCall(1800, () => box.destroy());
  }
}
