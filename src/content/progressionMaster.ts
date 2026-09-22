export type EquipmentMasterEntry = {
    id: string;
    nameJa: string;
    family: string;
    tier: number;
    effectTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

export type ResearchMasterEntry = {
    id: string;
    nameJa: string;
    branch: string;
    level: number;
    unlockTags: string[];
    status: 'PREPARED';
};

export type MuseumMasterEntry = {
    id: string;
    nameJa: string;
    wing: string;
    slot: number;
    sourceTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

export type TreasureMasterEntry = {
    id: string;
    nameJa: string;
    theme: string;
    rank: number;
    useTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

const equipmentFamilies = [
    ['pickaxe', 'ツルハシ', ['mining', 'power']],
    ['drill', '採掘ドリル', ['mining', 'speed']],
    ['rod', '釣竿', ['fishing', 'control']],
    ['reel', 'リール', ['fishing', 'power']],
    ['lantern', '探検灯', ['explore', 'visibility']],
    ['boots', '探索靴', ['explore', 'travel']],
    ['backpack', '冒険鞄', ['inventory', 'expedition']],
    ['toolkit', '整備工具', ['craft', 'transport']],
    ['chef_kit', '料理道具', ['cooking', 'quality']],
    ['survey_kit', '調査機器', ['research', 'discovery']],
] as const;
const equipmentTiers = [
    ['wood', '木製'], ['copper', '銅製'], ['iron', '鉄製'], ['steel', '鋼製'], ['mythril', 'ミスリル'], ['star', '星晶'],
] as const;

export const equipmentMaster: EquipmentMasterEntry[] = equipmentFamilies.flatMap(([family, label, effectTags]) => equipmentTiers.map(([tierSlug, tierLabel], tierIndex) => ({
    id: `equipment_${family}_${tierSlug}`,
    nameJa: `${tierLabel}${label}`,
    family,
    tier: tierIndex + 1,
    effectTags: [...effectTags, tierSlug],
    assetKey: `equipment/${family}/${tierSlug}`,
    status: 'PREPARED' as const,
})));

const researchBranches = [
    ['mining', '採掘工学', ['mine', 'ore', 'depth']],
    ['metallurgy', '冶金学', ['smelt', 'alloy', 'craft']],
    ['fishing', '水産学', ['fish', 'bait', 'rod']],
    ['agriculture', '農学', ['crop', 'soil', 'harvest']],
    ['food', '食品加工学', ['cooking', 'preserve', 'quality']],
    ['logistics', '物流工学', ['train', 'capacity', 'route']],
    ['commerce', '市場研究', ['trade', 'demand', 'price']],
    ['exploration', '探査技術', ['explore', 'route', 'risk']],
    ['museum', '収集学', ['museum', 'identify', 'donation']],
    ['world', '世界研究', ['weather', 'region', 'legendary']],
] as const;
const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;

export const researchMaster: ResearchMasterEntry[] = researchBranches.flatMap(([branch, label, unlockTags]) => roman.map((rank, index) => ({
    id: `research_${branch}_${index + 1}`,
    nameJa: `${label} ${rank}`,
    branch,
    level: index + 1,
    unlockTags: [...unlockTags, `tier_${index + 1}`],
    status: 'PREPARED' as const,
})));

const museumWings = [
    ['fish', '魚類展示室', ['fish', 'fishing']],
    ['mineral', '鉱物展示室', ['ore', 'gem']],
    ['fossil', '化石展示室', ['fossil', 'mine']],
    ['relic', '遺跡展示室', ['ruin', 'relic']],
    ['agriculture', '農業史展示室', ['crop', 'farm']],
    ['industry', '産業技術展示室', ['craft', 'machine']],
    ['railway', '鉄道展示室', ['train', 'route']],
    ['marine', '海洋展示室', ['deepsea', 'coral']],
    ['town_history', '街の歴史室', ['town', 'achievement']],
    ['legend', '伝説展示室', ['legendary', 'treasure']],
] as const;
const exhibitLabels = ['入口展示', '代表標本', '希少標本', '大型展示', '研究展示', '完全収集展示'] as const;

export const museumMaster: MuseumMasterEntry[] = museumWings.flatMap(([wing, wingLabel, sourceTags]) => exhibitLabels.map((exhibitLabel, index) => ({
    id: `museum_${wing}_${index + 1}`,
    nameJa: `${wingLabel}・${exhibitLabel}`,
    wing,
    slot: index + 1,
    sourceTags: [...sourceTags, `slot_${index + 1}`],
    assetKey: `museum/${wing}/${index + 1}`,
    status: 'PREPARED' as const,
})));

const treasureThemes = [
    ['pioneer', '開拓者', '開拓章'],
    ['river', '古河文明', '水紋遺物'],
    ['mine', '鉱山王', '坑道遺物'],
    ['forest', '森の民', '樹海遺物'],
    ['royal', '王家', '王家遺物'],
    ['desert', '砂海文明', '砂海遺物'],
    ['deepsea', '深海文明', '深海遺物'],
    ['sky', '天空文明', '天空遺物'],
    ['railway', '旧鉄道', '鉄道遺物'],
    ['astral', '星読み', '星辰遺物'],
    ['abyss', '深淵', '深淵遺物'],
    ['luna', '月の記録', '月影遺物'],
] as const;
const treasureRanks = [['fragment', '欠片'], ['relic', '遺物'], ['seal', '印章'], ['masterpiece', '至宝'], ['legend', '伝説級']] as const;

export const treasureMaster: TreasureMasterEntry[] = treasureThemes.flatMap(([theme, themeLabel, itemLabel]) => treasureRanks.map(([rankSlug, rankLabel], index) => ({
    id: `treasure_${theme}_${rankSlug}`,
    nameJa: `${themeLabel}${itemLabel}・${rankLabel}`,
    theme,
    rank: index + 1,
    useTags: ['museum', 'collection', index >= 3 ? 'quest_unlock' : 'trade'],
    assetKey: `treasure/${theme}/${rankSlug}`,
    status: 'PREPARED' as const,
})));
