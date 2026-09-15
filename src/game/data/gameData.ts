export const fishCatalog = ['アユ', 'コイ', 'ニジマス', 'ヤマメ'] as const;

export const explorationSites = [
  { name: '星降りの森', shortName: '森', x: 88, y: 270, color: 0x3c744c },
  { name: '風鳴り山', shortName: '山', x: 300, y: 250, color: 0x687786 },
  { name: '月影遺跡', shortName: '遺跡', x: 195, y: 380, color: 0x806548 }
] as const;

export const xpForLevel = (level: number) => 100 + (level - 1) * 40;
