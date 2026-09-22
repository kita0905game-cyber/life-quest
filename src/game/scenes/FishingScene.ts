import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { FISH_ATLAS, FISH_ATLAS_COLUMNS, FISH_ATLAS_ROWS } from '../assets/legacyAtlases';
import { FISHING_ART } from '../assets/legacyScenes';
import { addCoverImage, addSceneHeading, addSceneVignette, ensureGridFrames } from '../assets/legacyUi';
import { addBackButton } from './ui';
import { fishCatalog, fishRarity } from '../data/gameData';

type FishingStage = 'idle' | 'waiting' | 'hook' | 'reeling';

export class FishingScene extends Phaser.Scene {
  private stage: FishingStage = 'idle';
  private power = 0;
  private status?: Phaser.GameObjects.Text;
  private action?: Phaser.GameObjects.Text;
  private bobber?: Phaser.GameObjects.Arc;
  private meterFill?: Phaser.GameObjects.Rectangle;
  private meterText?: Phaser.GameObjects.Text;
  private decayEvent?: Phaser.Time.TimerEvent;

  constructor() { super('FishingScene'); }

  preload() {
    this.load.image('fishing-appdeploy', FISHING_ART);
    this.load.image('fish-atlas-appdeploy', FISH_ATLAS);
  }

  create() {
    const save = loadSave();
    this.stage = 'idle';
    this.power = 0;

    this.cameras.main.setBackgroundColor('#102e31');
    addCoverImage(this, 'fishing-appdeploy');
    addSceneVignette(this);
    addBackButton(this);
    addSceneHeading(this, 'THE WILLOW POND', '木漏れ日の釣り場', String(save.fishCaught), 'これまでの釣果');
    ensureGridFrames(this, 'fish-atlas-appdeploy', FISH_ATLAS_COLUMNS, FISH_ATLAS_ROWS, 'fish');

    // AppDeploy版の水面魚影。魚そのものではなく、景色に溶ける影として扱う。
    [
      { x: 110, y: 260, w: 48, d: 4100 },
      { x: 280, y: 330, w: 34, d: 5200 },
      { x: 155, y: 430, w: 42, d: 6100 },
      { x: 300, y: 210, w: 26, d: 4600 }
    ].forEach((item, index) => {
      const shadow = this.add.ellipse(item.x, item.y, item.w, Math.max(8, item.w * .28), 0x0d4542, .34).setDepth(4);
      this.tweens.add({
        targets: shadow,
        x: index % 2 === 0 ? item.x + 135 : item.x - 155,
        y: item.y + (index % 2 === 0 ? 18 : -12),
        duration: item.d,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut'
      });
    });

    const water = this.add.zone(195, 300, 288, 250)
      .setDepth(8)
      .setInteractive({ useHandCursor: true });
    water.on('pointerup', () => {
      if (this.stage === 'idle') this.castLine();
      else if (this.stage === 'hook') this.beginReel();
      else if (this.stage === 'reeling') this.reel();
    });

    this.bobber = this.add.circle(200, 330, 7, 0xf7e6bf, 1)
      .setStrokeStyle(4, 0xd65e3d)
      .setDepth(12)
      .setVisible(false);

    this.status = this.add.text(195, 500, '水面の魚影を狙おう', {
      fontSize: '11px',
      color: '#f2ead3',
      align: 'center',
      backgroundColor: '#102a24d9',
      padding: { x: 12, y: 7 }
    }).setOrigin(0.5).setDepth(20);

    this.add.rectangle(195, 543, 250, 16, 0x12382f, .86)
      .setStrokeStyle(1, 0xd0c391, .72)
      .setDepth(18);
    this.meterFill = this.add.rectangle(70, 543, 0, 12, 0x93c9a9, .95)
      .setOrigin(0, .5)
      .setDepth(19)
      .setVisible(false);
    this.meterText = this.add.text(195, 543, '', {
      fontSize: '9px',
      color: '#fffef0'
    }).setOrigin(.5).setDepth(20).setVisible(false);

    this.action = this.add.text(195, 580, '竿を投げる', {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '13px',
      color: '#fff0bd',
      backgroundColor: '#17372ee8',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor: true });
    this.action.on('pointerup', () => {
      if (this.stage === 'idle') this.castLine();
      else if (this.stage === 'hook') this.beginReel();
      else if (this.stage === 'reeling') this.reel();
    });

    this.add.text(18, 623, `🪱 ${save.bait}`, {
      fontSize: '16px',
      color: '#f8eacc'
    }).setDepth(20);
    this.add.text(18, 646, 'エサ', { fontSize: '8px', color: '#d6c6a8' }).setDepth(20);
    this.add.text(372, 628, `魚図鑑 ${save.discoveredFish.length}/12\n一匹ずつ、出会いを残そう`, {
      fontSize: '9px',
      color: '#eef0df',
      align: 'right'
    }).setOrigin(1, 0).setDepth(20);
  }

  private castLine() {
    if (this.stage !== 'idle') return;
    const save = loadSave();
    if (save.bait < 1) {
      this.status?.setText('釣りエサが足りない');
      return;
    }

    this.stage = 'waiting';
    this.action?.setText('静かに待つ…').disableInteractive();
    this.status?.setText('静かに…浮きが揺れている');
    this.bobber?.setVisible(true).setPosition(Phaser.Math.Between(155, 235), Phaser.Math.Between(300, 390)).setScale(.2);
    if (this.bobber) this.tweens.add({ targets: this.bobber, scale: 1, duration: 420, ease: 'Back.out' });
    updateSave((s) => ({ ...s, casts: s.casts + 1 }));

    this.time.delayedCall(900, () => {
      if (this.stage !== 'waiting') return;
      this.stage = 'hook';
      this.status?.setText('浮きが沈んだ！');
      this.action?.setText('アワセる！').setInteractive({ useHandCursor: true });
      if (this.bobber) {
        this.bobber.setFillStyle(0xffd46b);
        this.tweens.add({ targets: this.bobber, y: this.bobber.y + 16, duration: 120, yoyo: true, repeat: 4 });
      }
    });
  }

  private beginReel() {
    if (this.stage !== 'hook') return;
    this.stage = 'reeling';
    this.power = 0;
    this.status?.setText('魚が暴れている！ テンポよく巻き上げよう');
    this.action?.setText('巻き上げる');
    this.meterFill?.setVisible(true);
    this.meterText?.setVisible(true).setText('0%');

    this.decayEvent?.remove(false);
    this.decayEvent = this.time.addEvent({
      delay: 420,
      loop: true,
      callback: () => {
        if (this.stage !== 'reeling') return;
        this.power = Math.max(0, this.power - 3);
        this.refreshMeter();
      }
    });
  }

  private reel() {
    if (this.stage !== 'reeling') return;
    this.power = Math.min(100, this.power + 34);
    this.refreshMeter();
    this.cameras.main.shake(55, .004);
    if (this.power >= 100) this.catchFish();
  }

  private refreshMeter() {
    this.meterFill?.setDisplaySize(246 * this.power / 100, 12);
    this.meterText?.setText(`${this.power}%`);
  }

  private catchFish() {
    this.decayEvent?.remove(false);
    const now = new Date();
    const night = now.getHours() >= 19 || now.getHours() < 5;
    const autumn = now.getMonth() >= 8 && now.getMonth() <= 10;
    const weights: Record<string, number> = {
      メダカ: 22, フナ: 18, コイ: 12, ブラックバス: 10, アジ: 12, サバ: 10,
      タイ: 5, サケ: autumn ? 7 : 2, ウナギ: night ? 8 : 3, 金魚: 4, ニジマス: 4, 月影ゴイ: night ? 2 : .5
    };
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    let caught: string = fishCatalog[0];
    for (const fish of fishCatalog) {
      roll -= weights[fish];
      if (roll <= 0) { caught = fish; break; }
    }

    const size = Phaser.Math.Between(8, 95);
    const updated = updateSave((s) => ({
      ...s,
      bait: Math.max(0, s.bait - 1),
      fishCaught: s.fishCaught + 1,
      fishRecords: { ...s.fishRecords, [caught]: Math.max(s.fishRecords[caught] ?? 0, size) },
      discoveredFish: [...new Set([...s.discoveredFish, caught])],
      fishInventory: { ...s.fishInventory, [caught]: (s.fishInventory[caught] ?? 0) + 1 }
    }));

    const index = fishCatalog.findIndex((fish) => fish === caught);
    const rarity = fishRarity[caught] ?? 1;
    const card = this.add.rectangle(195, 340, 210, 230, 0x102a24, .95)
      .setStrokeStyle(1, 0xd8bd77, .85)
      .setDepth(40);
    const image = this.add.image(195, 330, 'fish-atlas-appdeploy', `fish-${Math.max(0, index)}`)
      .setDisplaySize(128, 128)
      .setDepth(42);
    const title = this.add.text(195, 245, '釣り上げた！', {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '13px',
      color: '#dfc884'
    }).setOrigin(.5).setDepth(42);
    const name = this.add.text(195, 405, caught, {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '20px',
      color: '#fff1c9'
    }).setOrigin(.5).setDepth(42);
    const detail = this.add.text(195, 435, `${'★'.repeat(rarity)} · ${size}cm\n自己最大 ${updated.fishRecords[caught]}cm`, {
      fontSize: '10px',
      color: '#c8d6c7',
      align: 'center'
    }).setOrigin(.5).setDepth(42);

    this.stage = 'idle';
    this.power = 0;
    this.meterFill?.setVisible(false);
    this.meterText?.setVisible(false);
    this.bobber?.setVisible(false).setFillStyle(0xf7e6bf);
    this.action?.setText('竿を投げる').setInteractive({ useHandCursor: true });
    this.status?.setText(`${caught} ${size}cm · エサ残り ${updated.bait}`);

    this.time.delayedCall(2100, () => {
      [card, image, title, name, detail].forEach((obj) => obj.destroy());
    });
  }
}
