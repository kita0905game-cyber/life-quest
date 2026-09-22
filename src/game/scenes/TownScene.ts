import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';

type Hotspot = {
  label: string;
  scene?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  locked?: boolean;
  message?: string;
};

const TOWN_ART_URL = 'https://raw.githubusercontent.com/kita0905game-cyber/life-quest-assets/main/life-quest-ideal.png';

const VIEW_W = 390;
const VIEW_H = 680;
const ART_W = 390;
const ART_H = 520;
const ART_TOP = 78;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.35;

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
  private world?: Phaser.GameObjects.Container;
  private zoom = 1;
  private panX = 0;
  private panY = 0;
  private dragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private originX = 0;
  private originY = 0;
  private moved = false;

  constructor() { super('TownScene'); }

  preload() {
    this.load.image('town-appdeploy', TOWN_ART_URL);
    this.load.image('town-fallback', './assets/town-v2.png');
  }

  create() {
    const save = loadSave();
    const { season, daypart } = seasonAndDaypart(new Date());

    this.cameras.main.setBackgroundColor('#10241f');

    // AppDeploy版の街カード構成をそのまま基準にする。
    this.add.rectangle(195, 31, 390, 62, 0x142823, 1).setDepth(30);
    this.add.text(17, 12, townRank(), {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '18px',
      color: '#eadfc0'
    }).setDepth(31);
    this.add.text(17, 38, `${season} · ${daypart}　人口100 · メイン開発街`, {
      fontSize: '10px',
      color: '#aeb5a0'
    }).setDepth(31);

    this.world = this.add.container(0, ART_TOP).setDepth(5);

    const artKey = this.textures.exists('town-appdeploy') ? 'town-appdeploy' : 'town-fallback';
    const art = this.add.image(ART_W / 2, ART_H / 2, artKey).setDisplaySize(ART_W, ART_H);
    art.setOrigin(0.5);
    this.world.add(art);

    // AppDeploy版の控えめな色調補正と下端の陰影。
    const shade = this.add.rectangle(ART_W / 2, ART_H / 2, ART_W, ART_H, 0x0b2018, 0.055);
    this.world.add(shade);
    const bottomShade = this.add.rectangle(ART_W / 2, ART_H - 18, ART_W, 36, 0x06100b, 0.3);
    this.world.add(bottomShade);

    const hotspots: Hotspot[] = [
      { label: 'BOSS城', scene: 'BossScene', x: .84, y: .08, width: 78, height: 58 },
      { label: '博物館', scene: 'MuseumScene', x: .14, y: .19, width: 82, height: 68 },
      { label: 'ギルド', scene: 'ExploreScene', x: .46, y: .27, width: 92, height: 72 },
      { label: '図書館', x: .16, y: .40, width: 82, height: 68, locked: true, message: '図書館は学習UIとの再接続候補。街の場所として先に復元。' },
      { label: 'マイハウス', scene: 'HouseScene', x: .73, y: .37, width: 92, height: 72 },
      { label: '鉱山', scene: 'MineScene', x: .86, y: .55, width: 84, height: 76 },
      { label: '工房', scene: 'WorkshopScene', x: .49, y: .64, width: 90, height: 74 },
      { label: '釣り場', scene: 'FishingScene', x: .18, y: .70, width: 90, height: 76 },
      { label: '中央駅', scene: 'RailwayScene', x: .82, y: .78, width: 94, height: 72 },
      { label: '中央広場', scene: 'GuildScene', x: .48, y: .49, width: 82, height: 62 },
      { label: '倉庫', scene: 'RecordsScene', x: .80, y: .82, width: 78, height: 60 }
    ];

    hotspots.forEach((spot) => this.addHotspot(spot));

    this.addTownControls(season, daypart);
    this.addTreasure(save.chests);
    this.installPanAndZoom();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.removeInputHandlers());
  }

  private addHotspot(spot: Hotspot) {
    if (!this.world) return;
    const x = spot.x * ART_W;
    const y = spot.y * ART_H;

    const zone = this.add.zone(x, y, spot.width, spot.height)
      .setInteractive({ useHandCursor: true });
    this.world.add(zone);

    const plaque = this.add.text(x, y + spot.height * 0.34, spot.label, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '8px',
      color: spot.locked ? '#c2c3ae' : '#f3e5be',
      backgroundColor: spot.locked ? '#23332de8' : '#1b3028ed',
      padding: { x: 8, y: 5 },
      stroke: '#5a482d',
      strokeThickness: 1
    }).setOrigin(.5).setAlpha(.92);
    this.world.add(plaque);

    const marker = this.add.circle(x, y + spot.height * 0.34 + 18, 2, 0xf0d28e, .95);
    this.world.add(marker);

    zone.on('pointerover', () => plaque.setAlpha(1));
    zone.on('pointerout', () => plaque.setAlpha(.92));
    zone.on('pointerdown', () => plaque.setScale(.97));
    zone.on('pointerup', () => {
      plaque.setScale(1);
      if (this.moved) return;
      if (spot.scene) {
        this.scene.start(spot.scene);
        return;
      }
      if (spot.message) this.flashMessage(spot.message);
    });
  }

  private addTownControls(season: string, daypart: string) {
    this.add.text(14, 608, `${season} · ${daypart}`, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '9px',
      color: '#eeddb5',
      backgroundColor: '#15281dd9',
      padding: { x: 9, y: 6 }
    }).setDepth(30);

    this.add.text(14, 642, '↔ 動かす · ⤢ 拡大', {
      fontSize: '9px',
      color: '#e4debd',
      backgroundColor: '#14271edb',
      padding: { x: 8, y: 5 }
    }).setDepth(30);

    const minus = this.add.text(255, 636, '−', {
      fontSize: '17px',
      color: '#e3d4ac',
      backgroundColor: '#15281eed',
      padding: { x: 11, y: 8 }
    }).setDepth(30).setInteractive({ useHandCursor: true });

    const zoomLabel = this.add.text(302, 638, '100%', {
      fontSize: '9px',
      color: '#baba9d',
      backgroundColor: '#15281eed',
      padding: { x: 7, y: 10 }
    }).setOrigin(.5, 0).setDepth(30);

    const plus = this.add.text(331, 636, '＋', {
      fontSize: '16px',
      color: '#e3d4ac',
      backgroundColor: '#15281eed',
      padding: { x: 9, y: 8 }
    }).setDepth(30).setInteractive({ useHandCursor: true });

    const reset = this.add.text(375, 636, '全体', {
      fontSize: '9px',
      color: '#e3d4ac',
      backgroundColor: '#15281eed',
      padding: { x: 8, y: 10 }
    }).setOrigin(1, 0).setDepth(30).setInteractive({ useHandCursor: true });

    const refresh = () => zoomLabel.setText(`${Math.round(this.zoom * 100)}%`);
    minus.on('pointerup', () => { this.setZoom(this.zoom - .15); refresh(); });
    plus.on('pointerup', () => { this.setZoom(this.zoom + .15); refresh(); });
    reset.on('pointerup', () => { this.zoom = 1; this.panX = 0; this.panY = 0; this.applyWorldTransform(); refresh(); });
  }

  private addTreasure(initialCount: number) {
    const treasure = this.add.text(376, 15, `宝箱 ×${initialCount}`, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '9px',
      color: '#f0ddb0',
      backgroundColor: '#1b3028e8',
      padding: { x: 8, y: 5 }
    }).setOrigin(1, 0).setDepth(40).setInteractive({ useHandCursor: true });

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

  private installPanAndZoom() {
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
    this.input.on('wheel', this.onWheel, this);
  }

  private removeInputHandlers() {
    this.input.off('pointerdown', this.onPointerDown, this);
    this.input.off('pointermove', this.onPointerMove, this);
    this.input.off('pointerup', this.onPointerUp, this);
    this.input.off('wheel', this.onWheel, this);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (pointer.y < ART_TOP || pointer.y > ART_TOP + ART_H) return;
    this.dragging = true;
    this.moved = false;
    this.dragStartX = pointer.x;
    this.dragStartY = pointer.y;
    this.originX = this.panX;
    this.originY = this.panY;
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.dragging || !pointer.isDown) return;
    const dx = pointer.x - this.dragStartX;
    const dy = pointer.y - this.dragStartY;
    if (!this.moved && Math.hypot(dx, dy) > 6) this.moved = true;
    if (!this.moved) return;
    this.panX = this.originX + dx;
    this.panY = this.originY + dy;
    this.clampPan();
    this.applyWorldTransform();
  }

  private onPointerUp() {
    this.dragging = false;
    this.time.delayedCall(80, () => { this.moved = false; });
  }

  private onWheel(
    _pointer: Phaser.Input.Pointer,
    _currentlyOver: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number
  ) {
    this.setZoom(this.zoom + (deltaY < 0 ? .12 : -.12));
  }

  private setZoom(next: number) {
    this.zoom = Phaser.Math.Clamp(next, MIN_ZOOM, MAX_ZOOM);
    this.clampPan();
    this.applyWorldTransform();
  }

  private clampPan() {
    const scaledW = ART_W * this.zoom;
    const scaledH = ART_H * this.zoom;
    const minX = Math.min(0, VIEW_W - scaledW);
    const minY = Math.min(0, ART_H - scaledH);
    this.panX = Phaser.Math.Clamp(this.panX, minX, 0);
    this.panY = Phaser.Math.Clamp(this.panY, minY, 0);
  }

  private applyWorldTransform() {
    this.world?.setPosition(this.panX, ART_TOP + this.panY);
    this.world?.setScale(this.zoom);
  }

  private flashMessage(message: string) {
    const box = this.add.text(195, 570, message, {
      fontSize: '10px',
      color: '#f3e4c8',
      align: 'center',
      backgroundColor: '#142d24eb',
      padding: { x: 14, y: 8 },
      wordWrap: { width: 300 }
    }).setOrigin(.5).setDepth(50);
    this.time.delayedCall(1900, () => box.destroy());
  }
}
