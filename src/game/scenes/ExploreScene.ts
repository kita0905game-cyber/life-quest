import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { EXPLORATION_ART } from '../assets/legacyScenes';
import { addCoverImage, addSceneHeading, addSceneVignette } from '../assets/legacyUi';
import { addBackButton } from './ui';
import { explorationSites } from '../data/gameData';

export class ExploreScene extends Phaser.Scene {
  private status?: Phaser.GameObjects.Text;

  constructor() { super('ExploreScene'); }

  preload() {
    this.load.image('exploration-appdeploy', EXPLORATION_ART);
  }

  create() {
    const save = loadSave();
    this.cameras.main.setBackgroundColor('#20342d');
    addCoverImage(this, 'exploration-appdeploy');
    addSceneVignette(this);
    addBackButton(this);
    addSceneHeading(this, 'BEYOND THE VALLEY', 'まだ見ぬ世界へ', String(save.discoveries), '探索の記録');

    const graphics = this.add.graphics().setDepth(7);
    graphics.lineStyle(1.4, 0xfff3c3, 0.58);
    graphics.lineBetween(207, 490, 98, 238);
    graphics.lineBetween(207, 490, 293, 211);

    const positions: Record<string, { x: number; y: number }> = {
      森: { x: 98, y: 238 },
      山: { x: 293, y: 211 },
      遺跡: { x: 207, y: 490 }
    };

    explorationSites.forEach(({ name, duration }) => {
      const pos = positions[name];
      const zone = this.add.zone(pos.x, pos.y, 96, 75)
        .setDepth(12)
        .setInteractive({ useHandCursor: true });

      const pin = this.add.rectangle(pos.x, pos.y - 10, 30, 30, 0x173d2e, .92)
        .setAngle(45)
        .setStrokeStyle(1, 0xe5d095, .9)
        .setDepth(10);
      this.add.circle(pos.x, pos.y - 10, 5, 0xe5d095, .9).setDepth(11);

      const label = this.add.text(pos.x, pos.y + 19, `${name}\n${Math.round(duration / 3_600_000 * 10) / 10}時間`, {
        fontFamily: 'Georgia, "Noto Serif JP", serif',
        fontSize: '10px',
        color: '#fff4d6',
        align: 'center',
        backgroundColor: '#153728e8',
        padding: { x: 9, y: 5 }
      }).setOrigin(.5).setDepth(11);

      zone.on('pointerover', () => {
        pin.setScale(1.08);
        label.setScale(1.04);
      });
      zone.on('pointerout', () => {
        pin.setScale(1);
        label.setScale(1);
      });
      zone.on('pointerup', () => this.startExpedition(name, duration));
    });

    this.status = this.add.text(195, 566, '', {
      fontSize: '10px',
      color: '#f3e4c8',
      align: 'center',
      backgroundColor: '#142d24eb',
      padding: { x: 15, y: 9 },
      wordWrap: { width: 300 }
    }).setOrigin(.5).setDepth(20);

    this.refreshStatus();
    this.time.addEvent({ delay: 1000, loop: true, callback: () => this.refreshStatus() });
  }

  private startExpedition(site: '森' | '山' | '遺跡', duration: number) {
    const save = loadSave();
    if (save.expedition) {
      this.refreshStatus();
      return;
    }
    if (save.explorationTickets < 1) {
      this.status?.setText('探索チケットが足りない');
      return;
    }

    const now = Date.now();
    updateSave((s) => ({
      ...s,
      explorationTickets: s.explorationTickets - 1,
      expedition: { site, startedAt: now, returnsAt: now + duration }
    }));
    this.refreshStatus();
  }

  private refreshStatus() {
    const save = loadSave();
    const exp = save.expedition;
    if (!exp) {
      this.status?.setText(`探索チケット ${save.explorationTickets} · 行き先をタップして出発`);
      this.status?.removeInteractive();
      return;
    }

    const left = exp.returnsAt - Date.now();
    if (left > 0) {
      const min = Math.ceil(left / 60000);
      this.status?.setText(`${exp.site}への遠征\n帰還まで 約${min}分 · アプリを閉じても進行`);
      this.status?.removeInteractive();
      return;
    }

    this.status?.setText(`${exp.site}から帰還済み\nタップして成果を受け取る`);
    this.status?.setInteractive({ useHandCursor: true });
    this.status?.removeAllListeners('pointerup');
    this.status?.once('pointerup', () => this.claim(exp.site));
  }

  private claim(site: '森' | '山' | '遺跡') {
    updateSave((s) => {
      let next = {
        ...s,
        expedition: null,
        discoveries: s.discoveries + 1,
        exploredLocations: { ...s.exploredLocations, [site]: (s.exploredLocations[site] ?? 0) + 1 }
      };
      if (site === '森') {
        next = { ...next, wood: next.wood + Phaser.Math.Between(4, 8), stone: next.stone + Phaser.Math.Between(1, 3), bait: next.bait + 1 };
      }
      if (site === '山') {
        next = {
          ...next,
          iron: next.iron + Phaser.Math.Between(2, 5),
          copper: next.copper + Phaser.Math.Between(1, 3),
          crystal: next.crystal + (Math.random() < .25 ? 1 : 0),
          gold: next.gold + Phaser.Math.Between(30, 70)
        };
      }
      if (site === '遺跡') {
        next = {
          ...next,
          gold: next.gold + Phaser.Math.Between(120, 240),
          chests: next.chests + (Math.random() < .45 ? 1 : 0),
          explorationTickets: next.explorationTickets + (Math.random() < .2 ? 1 : 0),
          crystal: next.crystal + (Math.random() < .18 ? 1 : 0)
        };
      }
      return next;
    });

    this.scene.restart();
  }
}
