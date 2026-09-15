import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';

export class MineScene extends Phaser.Scene {
  private hp = 3;
  private rock?: Phaser.GameObjects.Arc;
  private hpText?: Phaser.GameObjects.Text;
  private infoText?: Phaser.GameObjects.Text;
  private depthText?: Phaser.GameObjects.Text;

  constructor() { super('MineScene'); }

  preload() { this.load.image('mine-bg-v1', './assets/mine-v1.png'); }

  create() {
    this.cameras.main.setBackgroundColor('#17191a');
    this.add.image(195, 340, 'mine-bg-v1').setDisplaySize(510, 680);
    this.add.rectangle(195, 340, 390, 680, 0x050807, 0.22);
    addBackButton(this);
    addTitle(this, '鉱山', '岩盤を壊して地下へ進む');

    this.add.rectangle(195, 375, 360, 500, 0x232527, 0.22).setStrokeStyle(3, 0xb18b58, 0.65);
    this.depthText = this.add.text(280, 102, '', { fontSize: '16px', color: '#f1dfab' });

    this.rock = this.add.circle(195, 335, 105, 0x64615c)
      .setStrokeStyle(6, 0x827d74)
      .setInteractive({ useHandCursor: true });

    this.add.text(195, 335, '⛏', { fontSize: '58px' }).setOrigin(0.5);
    this.hpText = this.add.text(195, 465, '', { fontSize: '16px', color: '#f3e6bf' }).setOrigin(0.5);
    this.infoText = this.add.text(195, 515, '岩盤をタップ', { fontSize: '15px', color: '#ccd2ce' }).setOrigin(0.5);
    const upgrade=this.add.text(195,570,'鉱山を強化',{fontSize:'16px',color:'#fff0b5',backgroundColor:'#574a38',padding:{x:16,y:9}}).setOrigin(.5).setInteractive({useHandCursor:true});
    upgrade.on('pointerup',()=>{const s=loadSave();if(s.mineLevel>=3){this.infoText?.setText('鉱山 Lv.3 MAX');return;}const ok=s.mineLevel===1?s.gold>=180&&s.stone>=12&&s.ingots>=2:s.gold>=360&&s.stone>=24&&s.gears>=2&&s.crystal>=1;if(!ok){this.infoText?.setText('強化に必要なG・素材が足りない');return;}updateSave(v=>v.mineLevel===1?{...v,mineLevel:2,gold:v.gold-180,stone:v.stone-12,ingots:v.ingots-2}:{...v,mineLevel:3,gold:v.gold-360,stone:v.stone-24,gears:v.gears-2,crystal:v.crystal-1});this.infoText?.setText(`鉱山 Lv.${loadSave().mineLevel}！`);});

    this.rock.on('pointerup', () => this.mine());
    this.tweens.add({ targets: this.rock, scale: 1.025, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.refresh();
  }

  private mine() {
    const save = loadSave();
    if (save.energy <= 0) {
      this.infoText?.setText('採掘力がない');
      return;
    }

    updateSave((current) => ({ ...current, energy: current.energy - 1 }));
    this.hp -= 1;
    this.tweens.add({ targets: this.rock, angle: { from: -2, to: 2 }, duration: 55, yoyo: true, repeat: 2 });
    this.cameras.main.shake(80, 0.008);

    if (this.hp > 0) {
      this.infoText?.setText('岩盤にヒビが入った');
      this.refresh();
      return;
    }

    const level = save.mineLevel;
    const foundIron = Phaser.Math.Between(1, 100) <= Math.min(90, 55 + level * 10);
    const foundCopper = Phaser.Math.Between(1, 100) <= 30 + level * 10;
    const foundCrystal = Phaser.Math.FloatBetween(0, 100) <= 2.5 * level;
    const stone = Phaser.Math.Between(2, 4) + level - 1;
    updateSave((current) => ({
      ...current,
      depth: current.depth + 1,
      stone: current.stone + stone,
      iron: current.iron + (foundIron ? 1 + (level === 3 && Math.random() < .35 ? 1 : 0) : 0),
      copper: current.copper + (foundCopper ? 1 : 0), crystal: current.crystal + (foundCrystal ? 1 : 0),
      rocksBroken: current.rocksBroken + 1
    }));

    const bonus = `${foundIron ? ' 鉄' : ''}${foundCopper ? ' 銅' : ''}${foundCrystal ? ' ✦' : ''}`;
    this.infoText?.setText(`石材+${stone}${bonus}`);
    const drop = this.add.text(195, 330, `● 石材 +${stone}${bonus}`, { fontSize: '18px', fontStyle: 'bold', color: foundIron ? '#ffc96d' : '#e0ded5', backgroundColor: '#101716cc', padding: { x: 9, y: 5 } }).setOrigin(0.5);
    this.tweens.add({ targets: drop, y: 250, alpha: 0, duration: 950, onComplete: () => drop.destroy() });
    this.hp = 3;
    this.refresh();
  }

  private refresh() {
    const save = loadSave();
    this.hpText?.setText(`岩盤 ${'◆'.repeat(this.hp)}${'◇'.repeat(3 - this.hp)}   採掘力 ${save.energy}`);
    this.depthText?.setText(`B${save.depth}F · Lv.${save.mineLevel}`);
  }
}
