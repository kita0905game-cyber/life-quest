import Phaser from 'phaser';
import { loadSave } from '../../save/SaveRepository';
import { fishCatalog, fishRarity, materialCatalog } from '../data/gameData';
import { addBackButton, addTitle } from './ui';
export class MuseumScene extends Phaser.Scene {
  constructor(){super('MuseumScene');}
  create(){ this.cameras.main.setBackgroundColor('#17333a'); addBackButton(this); addTitle(this,'博物館・図鑑','素材9・魚12・イベントカード6');
    const s=loadSave(); const foundFish=s.discoveredFish.length; const foundItems=s.discoveredItems.length;
    this.add.text(195,108,`総発見 ${foundItems+foundFish+s.eventCards.length} / 27`,{fontSize:'19px',color:'#ffe7a3',fontStyle:'bold'}).setOrigin(.5);
    this.add.text(25,140,'素材',{fontSize:'16px',color:'#e7c66e'});
    materialCatalog.forEach(([key,name],i)=>{ const found=s.discoveredItems.includes(key); this.add.text(25+(i%2)*180,170+Math.floor(i/2)*28,found?`◆ ${name}`:'◇ ?????',{fontSize:'13px',color:found?'#eef5dc':'#65767a'}); });
    this.add.text(25,320,`魚　${foundFish}/12`,{fontSize:'16px',color:'#77cde1'});
    fishCatalog.forEach((fish,i)=>{const size=s.fishRecords[fish];const found=s.discoveredFish.includes(fish);const label=found?(size?`${'★'.repeat(fishRarity[fish])} ${fish} ${size}cm`:`${'★'.repeat(fishRarity[fish])} ${fish}`):'？？？ 未発見';this.add.text(25+(i%2)*180,350+Math.floor(i/2)*31,label,{fontSize:'12px',color:found?'#dff5fb':'#65767a'});});
    this.add.text(25,555,`イベントカード　${s.eventCards.length}/6`,{fontSize:'16px',color:'#e7c66e'});
    this.add.text(25,585,s.eventCards.length?s.eventCards.join('・'):'冒険を重ねると記録される',{fontSize:'12px',color:'#d8e4d4',wordWrap:{width:340}});
  }
}
