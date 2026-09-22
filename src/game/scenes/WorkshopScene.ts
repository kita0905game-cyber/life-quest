import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { MATERIAL_ATLAS, MATERIAL_ATLAS_COLUMNS, MATERIAL_ATLAS_ROWS } from '../assets/legacyAtlases';
import { WORKSHOP_ART } from '../assets/legacyScenes';
import { addCoverImage, addSceneFooter, addSceneHeading, addSceneVignette, ensureGridFrames } from '../assets/legacyUi';
import { addBackButton } from './ui';

type Recipe = {
  name: string;
  station: string;
  need: string;
  frame: number;
  level: number;
  x: number;
  y: number;
  canCraft: () => boolean;
  craft: () => void;
};

export class WorkshopScene extends Phaser.Scene {
  private status?: Phaser.GameObjects.Text;

  constructor() { super('WorkshopScene'); }

  preload() {
    this.load.image('workshop-appdeploy', WORKSHOP_ART);
    this.load.image('materials-appdeploy', MATERIAL_ATLAS);
  }

  create() {
    const save = loadSave();
    this.cameras.main.setBackgroundColor('#231a14');
    addCoverImage(this, 'workshop-appdeploy');
    addSceneVignette(this);
    addBackButton(this);
    addSceneHeading(this, `THE ARTISAN'S HEARTH · LV.${save.workshopLevel}`, '職人の工房', '⚒', '素材をかたちに');
    ensureGridFrames(this, 'materials-appdeploy', MATERIAL_ATLAS_COLUMNS, MATERIAL_ATLAS_ROWS, 'material');

    const recipes: Recipe[] = [
      {
        name: '鉄インゴット',
        station: '精錬炉',
        need: '鉄鉱石 ×3',
        frame: 5,
        level: 1,
        x: 100,
        y: 221,
        canCraft: () => loadSave().iron >= 3,
        craft: () => updateSave((s) => ({
          ...s,
          iron: s.iron - 3,
          ingots: s.ingots + 1,
          crafted: s.crafted + 1,
          discoveredItems: [...new Set([...s.discoveredItems, 'ingots'])]
        }))
      },
      {
        name: '銅インゴット',
        station: '鋳造台',
        need: '銅鉱石 ×3',
        frame: 6,
        level: 1,
        x: 298,
        y: 228,
        canCraft: () => loadSave().copper >= 3,
        craft: () => updateSave((s) => ({
          ...s,
          copper: s.copper - 3,
          copperIngots: s.copperIngots + 1,
          crafted: s.crafted + 1,
          discoveredItems: [...new Set([...s.discoveredItems, 'copperIngots'])]
        }))
      },
      {
        name: '歯車',
        station: '作業台',
        need: '鉄インゴット ×2・銅 ×1',
        frame: 7,
        level: 1,
        x: 107,
        y: 418,
        canCraft: () => {
          const s = loadSave();
          return s.ingots >= 2 && s.copperIngots >= 1;
        },
        craft: () => updateSave((s) => ({
          ...s,
          ingots: s.ingots - 2,
          copperIngots: s.copperIngots - 1,
          gears: s.gears + 1,
          crafted: s.crafted + 1,
          discoveredItems: [...new Set([...s.discoveredItems, 'gears'])]
        }))
      },
      {
        name: '開拓ランタン',
        station: '細工作業台',
        need: '銅 ×1・木材 ×2・石材 ×2',
        frame: 8,
        level: 2,
        x: 291,
        y: 432,
        canCraft: () => {
          const s = loadSave();
          return s.workshopLevel >= 2 && s.copperIngots >= 1 && s.wood >= 2 && s.stone >= 2;
        },
        craft: () => updateSave((s) => ({
          ...s,
          copperIngots: s.copperIngots - 1,
          wood: s.wood - 2,
          stone: s.stone - 2,
          lanterns: s.lanterns + 1,
          crafted: s.crafted + 1,
          discoveredItems: [...new Set([...s.discoveredItems, 'lanterns'])]
        }))
      }
    ];

    recipes.forEach((recipe) => {
      const zone = this.add.zone(recipe.x, recipe.y, 121, 156)
        .setDepth(12)
        .setInteractive({ useHandCursor: true });

      const ready = recipe.level <= save.workshopLevel && recipe.canCraft();
      const marker = this.add.circle(recipe.x, recipe.y - 30, 6, ready ? 0x9ed9a5 : 0xc2b68f, 0.82)
        .setStrokeStyle(1, 0xffe2a4, 0.8)
        .setDepth(14);

      const label = this.add.text(recipe.x, recipe.y + 58, recipe.station + '\n' + (recipe.level > save.workshopLevel ? `Lv.${recipe.level}で解放` : ready ? '製作できる' : '素材不足'), {
        fontSize: '9px',
        color: '#ffefc8',
        align: 'center',
        backgroundColor: '#11281de8',
        padding: { x: 8, y: 6 }
      }).setOrigin(0.5).setDepth(14);

      zone.on('pointerover', () => label.setScale(1.04));
      zone.on('pointerout', () => label.setScale(1));
      zone.on('pointerup', () => {
        const current = loadSave();
        if (current.workshopLevel < recipe.level) {
          this.status?.setText(`${recipe.name}は工房 Lv.${recipe.level}で解放`);
          return;
        }
        if (!recipe.canCraft()) {
          this.status?.setText(`${recipe.name}：${recipe.need}`);
          return;
        }

        recipe.craft();
        this.status?.setText(`${recipe.name}を製作した！`);
        marker.setFillStyle(0xe2cf83, 1);

        const icon = this.add.image(195, 360, 'materials-appdeploy', `material-${recipe.frame}`)
          .setDisplaySize(76, 76)
          .setDepth(30)
          .setAlpha(0);
        this.tweens.add({
          targets: icon,
          alpha: 1,
          scale: { from: 0.65, to: 1.05 },
          y: 325,
          duration: 520,
          yoyo: true,
          hold: 420,
          onComplete: () => icon.destroy()
        });
        this.cameras.main.flash(110, 242, 181, 93, false);
      });
    });

    this.status = this.add.text(195, 536, '設備を直接タップして製作', {
      fontSize: '11px',
      color: '#f2e3c4',
      align: 'center',
      backgroundColor: '#0f1c17bc',
      padding: { x: 10, y: 7 }
    }).setOrigin(0.5).setDepth(20);

    const upgrade = this.add.text(362, 580, `工房 Lv.${save.workshopLevel}`, {
      fontSize: '9px',
      color: '#f1d28b',
      backgroundColor: '#17251ee8',
      padding: { x: 9, y: 6 }
    }).setOrigin(1, 0.5).setDepth(20).setInteractive({ useHandCursor: true });

    upgrade.on('pointerup', () => {
      const s = loadSave();
      if (s.workshopLevel >= 3) {
        this.status?.setText('工房 Lv.3 MAX');
        return;
      }
      const ok = s.workshopLevel === 1
        ? s.gold >= 220 && s.wood >= 8 && s.ingots >= 2 && s.copperIngots >= 2
        : s.gold >= 450 && s.wood >= 12 && s.gears >= 3 && s.lanterns >= 1;
      if (!ok) {
        this.status?.setText('強化に必要なG・素材が足りない');
        return;
      }
      updateSave((v) => v.workshopLevel === 1
        ? { ...v, workshopLevel: 2, gold: v.gold - 220, wood: v.wood - 8, ingots: v.ingots - 2, copperIngots: v.copperIngots - 2 }
        : { ...v, workshopLevel: 3, gold: v.gold - 450, wood: v.wood - 12, gears: v.gears - 3, lanterns: v.lanterns - 1 });
      this.scene.restart();
    });

    addSceneFooter(this, `製作 ${save.crafted}`, 'これまでの加工', '鉱石 → インゴット → 部品。設備そのものを触って加工する。');
  }
}
