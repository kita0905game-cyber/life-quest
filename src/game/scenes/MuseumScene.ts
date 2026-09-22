import Phaser from 'phaser';
import { loadSave } from '../../save/SaveRepository';
import { FISH_ATLAS, FISH_ATLAS_COLUMNS, FISH_ATLAS_ROWS, MATERIAL_ATLAS, MATERIAL_ATLAS_COLUMNS, MATERIAL_ATLAS_ROWS } from '../assets/legacyAtlases';
import { fishCatalog, fishRarity, materialCatalog } from '../data/gameData';
import { ensureGridFrames } from '../assets/legacyUi';
import { addBackButton, addTitle } from './ui';

export class MuseumScene extends Phaser.Scene {
  constructor() { super('MuseumScene'); }

  preload() {
    this.load.image('museum-fish-atlas', FISH_ATLAS);
    this.load.image('museum-material-atlas', MATERIAL_ATLAS);
  }

  create() {
    this.cameras.main.setBackgroundColor('#122824');
    addBackButton(this);
    addTitle(this, '博物館', '集めたものを、世界の記録として残す');
    ensureGridFrames(this, 'museum-fish-atlas', FISH_ATLAS_COLUMNS, FISH_ATLAS_ROWS, 'fish');
    ensureGridFrames(this, 'museum-material-atlas', MATERIAL_ATLAS_COLUMNS, MATERIAL_ATLAS_ROWS, 'material');

    const save = loadSave();
    const foundFish = save.discoveredFish.length;
    const foundItems = save.discoveredItems.length;

    this.add.text(195, 101, `COLLECTION · ${foundItems + foundFish + save.eventCards.length}/27`, {
      fontFamily: 'Georgia, serif',
      fontSize: '11px',
      color: '#d8bd77'
    }).setOrigin(.5);

    this.add.text(18, 128, `素材　${foundItems}/9`, {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '14px',
      color: '#e7c66e'
    });

    materialCatalog.forEach(([key, name], index) => {
      const found = save.discoveredItems.includes(key);
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 67 + col * 128;
      const y = 174 + row * 63;

      this.add.rectangle(x, y, 112, 56, 0x1a332d, found ? .78 : .36)
        .setStrokeStyle(1, found ? 0x8b7b53 : 0x42554e, .65);

      if (found) {
        this.add.image(x - 33, y, 'museum-material-atlas', `material-${index}`)
          .setDisplaySize(42, 42);
      } else {
        this.add.text(x - 33, y, '?', { fontSize: '22px', color: '#60736c' }).setOrigin(.5);
      }

      this.add.text(x - 4, y - 8, found ? name : '?????', {
        fontSize: '9px',
        color: found ? '#f0e3bd' : '#65766f'
      });
      this.add.text(x - 4, y + 8, found ? `×${this.materialCount(save, key)}` : '未発見', {
        fontSize: '8px',
        color: found ? '#cbb77e' : '#566861'
      });
    });

    this.add.text(18, 368, `魚類展示　${foundFish}/12`, {
      fontFamily: 'Georgia, "Noto Serif JP", serif',
      fontSize: '14px',
      color: '#9dd8dc'
    });

    fishCatalog.forEach((fish, index) => {
      const found = save.discoveredFish.includes(fish);
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = 51 + col * 96;
      const y = 418 + row * 76;

      this.add.rectangle(x, y, 84, 68, 0x16343a, found ? .75 : .32)
        .setStrokeStyle(1, found ? 0x5c8790 : 0x40565a, .65);

      if (found) {
        this.add.image(x, y - 8, 'museum-fish-atlas', `fish-${index}`)
          .setDisplaySize(46, 46);
      } else {
        this.add.text(x, y - 8, '?', { fontSize: '22px', color: '#577077' }).setOrigin(.5);
      }

      this.add.text(x, y + 22, found ? fish : '?????', {
        fontSize: '7px',
        color: found ? '#e3f2ef' : '#607277'
      }).setOrigin(.5);

      if (found) {
        this.add.text(x, y + 31, '★'.repeat(fishRarity[fish] ?? 1), {
          fontSize: '6px',
          color: '#d9be6e'
        }).setOrigin(.5);
      }
    });

    this.add.text(195, 650, `イベントカード ${save.eventCards.length}/6 · 殿堂 ${Object.keys(save.hallOfFame).length}`, {
      fontSize: '9px',
      color: '#c9b784'
    }).setOrigin(.5);
  }

  private materialCount(save: ReturnType<typeof loadSave>, key: string) {
    const values: Record<string, number> = {
      stone: save.stone,
      iron: save.iron,
      copper: save.copper,
      wood: save.wood,
      crystal: save.crystal,
      ingots: save.ingots,
      copperIngots: save.copperIngots,
      gears: save.gears,
      lanterns: save.lanterns
    };
    return values[key] ?? 0;
  }
}
