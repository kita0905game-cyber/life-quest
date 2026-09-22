import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { MINE_ART } from '../assets/legacyScenes';
import { addCoverImage, addSceneFooter, addSceneHeading, addSceneVignette } from '../assets/legacyUi';
import { addBackButton } from './ui';

export class MineScene extends Phaser.Scene {
  private hits = 0;
  private status?: Phaser.GameObjects.Text;
  private hitLabel?: Phaser.GameObjects.Text;
  private fractures?: Phaser.GameObjects.Graphics;

  constructor() { super('MineScene'); }

  preload() {
    this.load.image('mine-appdeploy', MINE_ART);
  }

  create() {
    const save = loadSave();
    this.cameras.main.setBackgroundColor('#101817');
    addCoverImage(this, 'mine-appdeploy');
    addSceneVignette(this);
    addBackButton(this);
    addSceneHeading(this, `THE COPPER HOLLOW · LV.${save.mineLevel}`, '灯りの坑道', `B${save.depth}`, '現在の深度');

    const target = this.add.zone(238, 309, 226, 265)
      .setDepth(12)
      .setInteractive({ useHandCursor: true });

    const reticle = this.add.circle(238, 309, 16, 0xffdfa1, 0.12)
      .setStrokeStyle(1, 0xfff2c7, 0.65)
      .setDepth(14);
    this.tweens.add({ targets: reticle, scale: 1.22, alpha: 0.45, duration: 1350, yoyo: true, repeat: -1 });

    this.fractures = this.add.graphics().setDepth(13);
    this.hitLabel = this.add.text(238, 405, '岩盤を叩く\n0/3 HITS', {
      fontSize: '11px',
      color: '#f6e8c6',
      align: 'center',
      backgroundColor: '#15241cd9',
      padding: { x: 12, y: 7 }
    }).setOrigin(0.5).setDepth(15);

    this.status = this.add.text(195, 548, '岩盤を3打で破壊 · 採掘力 −1', {
      fontSize: '11px',
      color: '#e7dcc2',
      align: 'center',
      backgroundColor: '#0b1714a8',
      padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setDepth(15);

    target.on('pointerup', () => this.strike());
    addSceneFooter(this, `⚡ ${save.energy}`, '採掘力', '岩盤を直接タップして鉱脈を掘り進む');

    const upgrade = this.add.text(350, 580, `鉱山 Lv.${save.mineLevel}`, {
      fontSize: '9px',
      color: '#f2db9a',
      backgroundColor: '#15241ce8',
      padding: { x: 9, y: 6 }
    }).setOrigin(1, 0.5).setDepth(20).setInteractive({ useHandCursor: true });

    upgrade.on('pointerup', () => {
      const s = loadSave();
      if (s.mineLevel >= 3) {
        this.status?.setText('鉱山 Lv.3 MAX');
        return;
      }
      const ok = s.mineLevel === 1
        ? s.gold >= 180 && s.stone >= 12 && s.ingots >= 2
        : s.gold >= 360 && s.stone >= 24 && s.gears >= 2 && s.crystal >= 1;
      if (!ok) {
        this.status?.setText('強化に必要なG・素材が足りない');
        return;
      }
      updateSave((v) => v.mineLevel === 1
        ? { ...v, mineLevel: 2, gold: v.gold - 180, stone: v.stone - 12, ingots: v.ingots - 2 }
        : { ...v, mineLevel: 3, gold: v.gold - 360, stone: v.stone - 24, gears: v.gears - 2, crystal: v.crystal - 1 });
      this.scene.restart();
    });
  }

  private strike() {
    const save = loadSave();
    if (save.energy < 1) {
      this.status?.setText('採掘力がない。学習で補充しよう。');
      return;
    }

    this.hits += 1;
    this.cameras.main.shake(85, 0.007);
    this.drawFractures();
    this.hitLabel?.setText(`岩盤を叩く\n${this.hits}/3 HITS`);

    const dust = this.add.circle(238, 309, 8, 0xe6cc98, 0.7).setDepth(14);
    this.tweens.add({ targets: dust, scale: 4, alpha: 0, duration: 420, onComplete: () => dust.destroy() });

    if (this.hits < 3) {
      this.status?.setText(this.hits === 1 ? '岩盤にヒビが入った。あと2打。' : '鉱脈が見えた。あと1打。');
      return;
    }

    const level = save.mineLevel;
    const foundIron = Phaser.Math.Between(1, 100) <= Math.min(90, 55 + level * 10);
    const foundCopper = Phaser.Math.Between(1, 100) <= 30 + level * 10;
    const foundCrystal = Phaser.Math.FloatBetween(0, 100) <= 2.5 * level;
    const stone = Phaser.Math.Between(2, 4) + level - 1;

    updateSave((current) => ({
      ...current,
      energy: Math.max(0, current.energy - 1),
      depth: current.depth + 1,
      stone: current.stone + stone,
      iron: current.iron + (foundIron ? 1 + (level === 3 && Math.random() < .35 ? 1 : 0) : 0),
      copper: current.copper + (foundCopper ? 1 : 0),
      crystal: current.crystal + (foundCrystal ? 1 : 0),
      rocksBroken: current.rocksBroken + 1
    }));

    const bonus = `${foundIron ? ' · 鉄' : ''}${foundCopper ? ' · 銅' : ''}${foundCrystal ? ' · クリスタル' : ''}`;
    this.status?.setText(`石材 +${stone}${bonus}`);
    const reward = this.add.text(238, 300, `石材 +${stone}${bonus}`, {
      fontSize: '13px',
      color: '#fff0c8',
      backgroundColor: '#11231dd9',
      padding: { x: 9, y: 6 }
    }).setOrigin(0.5).setDepth(30);
    this.tweens.add({ targets: reward, y: 245, alpha: 0, duration: 900, onComplete: () => reward.destroy() });

    this.hits = 0;
    this.fractures?.clear();
    this.hitLabel?.setText('岩盤を叩く\n0/3 HITS');
  }

  private drawFractures() {
    if (!this.fractures) return;
    this.fractures.clear();
    this.fractures.lineStyle(2, 0x1a160f, 0.95);
    if (this.hits >= 1) {
      this.fractures.beginPath();
      this.fractures.moveTo(238, 268); this.fractures.lineTo(226, 302); this.fractures.lineTo(244, 324); this.fractures.lineTo(232, 348);
      this.fractures.strokePath();
    }
    if (this.hits >= 2) {
      this.fractures.beginPath();
      this.fractures.moveTo(244, 324); this.fractures.lineTo(280, 316); this.fractures.lineTo(300, 296);
      this.fractures.moveTo(232, 348); this.fractures.lineTo(202, 362); this.fractures.lineTo(184, 386);
      this.fractures.strokePath();
    }
  }
}
