import Phaser from 'phaser';
import { loadSave, updateSave } from '../../save/SaveRepository';
import { addBackButton, addTitle } from './ui';
import { explorationSites } from '../data/gameData';

export class ExploreScene extends Phaser.Scene {
  constructor() { super('ExploreScene'); }
  preload() { this.load.image('explore-bg-v1', './assets/explore-v1.png'); }
  create() {
    this.add.image(195, 340, 'explore-bg-v1').setDisplaySize(510, 680);
    this.add.rectangle(195, 340, 390, 680, 0x071210, .18); addBackButton(this); addTitle(this, '探索地図', '閉じている間も遠征は進む');
    const result = this.add.text(195, 525, '', { fontSize:'15px', color:'#fff1bf', align:'center', backgroundColor:'#071210cc', padding:{x:8,y:6} }).setOrigin(.5);
    const describe = () => {
      const save = loadSave(); const exp = save.expedition;
      if (!exp) return result.setText(`探索チケット ${save.explorationTickets}　目的地をタップして派遣`);
      const left = exp.returnsAt - Date.now();
      if (left > 0) return result.setText(`${exp.site}を探索中… 残り ${Math.ceil(left/60000)}分`);
      result.setText(`${exp.site}から帰還済み\nここをタップして報酬を受け取る`).setInteractive({useHandCursor:true}).once('pointerup', ()=>this.claim(exp.site));
    };
    explorationSites.forEach(({name,shortName,x,y,color,duration}) => {
      const node=this.add.circle(x,y,48,color).setStrokeStyle(4,0xd2b36e).setInteractive({useHandCursor:true});
      this.add.text(x,y,shortName,{fontSize:'20px',fontStyle:'bold',color:'#fff2bf'}).setOrigin(.5);
      this.tweens.add({targets:node,scale:1.08,alpha:.88,duration:1100+x,yoyo:true,repeat:-1});
      node.on('pointerup',()=>{ const save=loadSave(); if(save.expedition){describe();return;} if(save.explorationTickets<1){result.setText('探索チケットが足りない');return;}
        const now=Date.now(); updateSave(s=>({...s,explorationTickets:s.explorationTickets-1,expedition:{site:name,startedAt:now,returnsAt:now+duration}})); describe(); });
    });
    describe(); this.time.addEvent({delay:1000,loop:true,callback:describe});
  }
  private claim(site:'森'|'山'|'遺跡') {
    updateSave(s=>{ let next={...s, expedition:null, discoveries:s.discoveries+1, exploredLocations:{...s.exploredLocations,[site]:(s.exploredLocations[site]??0)+1}};
      if(site==='森') next={...next,wood:next.wood+Phaser.Math.Between(4,8),stone:next.stone+Phaser.Math.Between(1,3),bait:next.bait+1};
      if(site==='山') next={...next,iron:next.iron+Phaser.Math.Between(2,5),copper:next.copper+Phaser.Math.Between(1,3),crystal:next.crystal+(Math.random()<.25?1:0),gold:next.gold+Phaser.Math.Between(30,70)};
      if(site==='遺跡') next={...next,gold:next.gold+Phaser.Math.Between(120,240),chests:next.chests+(Math.random()<.45?1:0),explorationTickets:next.explorationTickets+(Math.random()<.2?1:0),crystal:next.crystal+(Math.random()<.18?1:0)};
      return next; }); this.scene.restart();
  }
}
