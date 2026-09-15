export const fishCatalog = ['メダカ','フナ','コイ','ブラックバス','アジ','サバ','タイ','サケ','ウナギ','金魚','ニジマス','月影ゴイ'] as const;
export const fishRarity: Record<string, number> = { メダカ:1,フナ:1,コイ:2,ブラックバス:2,アジ:1,サバ:1,タイ:3,サケ:3,ウナギ:3,金魚:3,ニジマス:4,月影ゴイ:5 };
export const materialCatalog = [['stone','石材'],['iron','鉄鉱石'],['copper','銅鉱石'],['wood','木材'],['crystal','クリスタル'],['ingots','鉄インゴット'],['copperIngots','銅インゴット'],['gears','歯車'],['lanterns','開拓ランタン']] as const;
export const explorationSites = [
  { name:'森', shortName:'森', x:88, y:270, color:0x3c744c, duration:1_800_000 },
  { name:'山', shortName:'山', x:300, y:250, color:0x687786, duration:7_200_000 },
  { name:'遺跡', shortName:'遺跡', x:195, y:380, color:0x806548, duration:21_600_000 }
] as const;
export const xpForLevel = () => 100;
