export type NpcMasterEntry = {
    id: string;
    nameJa: string;
    role: string;
    homeHint: string;
    dialogueTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

export type QuestTemplateMasterEntry = {
    id: string;
    nameJa: string;
    archetype: string;
    targetTag: string;
    rewardTags: string[];
    status: 'PREPARED';
};

export type AchievementMasterEntry = {
    id: string;
    nameJa: string;
    category: string;
    milestone: number;
    rewardHint: string;
    assetKey: string;
    status: 'PREPARED';
};

const npcRoles = [
    ['guild_master', 'ギルドマスター', 'home_town'],
    ['miner', '鉱夫', 'ironridge_mine'],
    ['blacksmith', '鍛冶職人', 'forge_city'],
    ['fisher', '漁師', 'harbor_city'],
    ['farmer', '農家', 'grain_village'],
    ['merchant', '商人', 'home_town'],
    ['conductor', '車掌', 'home_town'],
    ['engineer', '機関士', 'forge_city'],
    ['researcher', '研究者', 'home_town'],
    ['curator', '学芸員', 'royal_capital'],
    ['chef', '料理人', 'hot_spring_village'],
    ['innkeeper', '宿屋主人', 'home_town'],
    ['ranger', '森林レンジャー', 'greenwood_forest'],
    ['explorer', '探検家', 'ancient_ruins'],
    ['marine_biologist', '海洋学者', 'harbor_city'],
    ['botanist', '植物学者', 'grain_village'],
    ['collector', '収集家', 'royal_capital'],
    ['postmaster', '郵便局長', 'home_town'],
] as const;

const npcNames = [
    ['allen', 'アレン'], ['mina', 'ミナ'], ['gord', 'ゴード'], ['lily', 'リリィ'], ['kai', 'カイ'], ['emma', 'エマ'], ['reid', 'レイド'], ['sara', 'サラ'],
    ['noel', 'ノエル'], ['tess', 'テス'], ['bram', 'ブラム'], ['fina', 'フィナ'], ['leo', 'レオ'], ['nina', 'ニナ'], ['otto', 'オットー'], ['claire', 'クレア'],
    ['hugo', 'ヒューゴ'], ['iris', 'アイリス'], ['felix', 'フェリクス'], ['mari', 'マリ'], ['dante', 'ダンテ'], ['elise', 'エリーゼ'], ['rufus', 'ルーファス'], ['anna', 'アンナ'],
    ['cedric', 'セドリック'], ['mabel', 'メイベル'], ['lars', 'ラース'], ['flora', 'フローラ'], ['silas', 'サイラス'], ['mona', 'モナ'], ['edgar', 'エドガー'], ['sophie', 'ソフィー'],
    ['glen', 'グレン'], ['heidi', 'ハイジ'], ['lucas', 'ルーカス'], ['maya', 'マヤ'], ['ben', 'ベン'], ['stella', 'ステラ'], ['oscar', 'オスカー'], ['rhea', 'レア'],
    ['ivan', 'イヴァン'], ['alma', 'アルマ'], ['theo', 'テオ'], ['june', 'ジュン'], ['marco', 'マルコ'], ['rosa', 'ローザ'], ['nash', 'ナッシュ'], ['celia', 'セリア'],
    ['bruno', 'ブルーノ'], ['elsa', 'エルサ'], ['ren', 'レン'], ['violet', 'ヴァイオレット'], ['dario', 'ダリオ'], ['yuna', 'ユナ'], ['garth', 'ガース'], ['mira', 'ミラ'],
    ['sean', 'ショーン'], ['luna_npc', 'ルナ'], ['pietro', 'ピエトロ'], ['ada', 'エイダ'], ['basil', 'バジル'], ['nora', 'ノラ'], ['keith', 'キース'], ['ella', 'エラ'],
    ['roman', 'ロマン'], ['faye', 'フェイ'], ['toby', 'トビー'], ['lena', 'レナ'], ['milo', 'ミロ'], ['cora', 'コーラ'], ['vince', 'ヴィンス'], ['aria', 'アリア'],
] as const;

export const npcMaster: NpcMasterEntry[] = npcNames.map(([slug, nameJa], index) => {
    const role = npcRoles[index % npcRoles.length];
    return {
        id: `npc_${slug}`,
        nameJa,
        role: role[0],
        homeHint: role[2],
        dialogueTags: [role[0], role[1], 'daily', 'request'],
        assetKey: `npc/${slug}`,
        status: 'PREPARED',
    };
});

const questArchetypes = [
    ['deliver', '納品依頼', ['fish', 'ore', 'crop', 'food', 'trade', 'relic']],
    ['craft', '製作依頼', ['ingot', 'tool', 'food', 'machine', 'rail', 'museum']],
    ['discover', '発見依頼', ['fish', 'region', 'ore', 'plant', 'treasure', 'weather']],
    ['explore', '探索依頼', ['forest', 'mountain', 'ruin', 'desert', 'snow', 'abyss']],
    ['trade', '交易依頼', ['harbor', 'capital', 'farm', 'forge', 'north', 'island']],
    ['transport', '物流依頼', ['ore', 'fish', 'food', 'machine', 'mail', 'research']],
    ['study', '現実成長依頼', ['bookkeeping', 'qualification', 'learning', 'exercise', 'project', 'routine']],
    ['museum', '博物館依頼', ['fish', 'mineral', 'fossil', 'relic', 'treasure', 'archive']],
    ['npc', '住民依頼', ['food', 'gift', 'material', 'travel', 'repair', 'collection']],
    ['challenge', '挑戦依頼', ['boss', 'rare_fish', 'deep_mine', 'long_route', 'master_craft', 'completion']],
] as const;

export const questTemplateMaster: QuestTemplateMasterEntry[] = questArchetypes.flatMap(([archetype, label, targets]) => targets.map((targetTag) => ({
    id: `quest_${archetype}_${targetTag}`,
    nameJa: `${label}・${targetTag}`,
    archetype,
    targetTag,
    rewardTags: ['xp', 'gold', 'material', 'reputation'],
    status: 'PREPARED' as const,
})));

const achievementCategories = [
    ['study', '学び', '称号・記念碑'],
    ['mining', '採掘', '鉱山装飾'],
    ['fishing', '釣り', '水辺装飾'],
    ['craft', '製作', '工房装飾'],
    ['explore', '探索', '地図装飾'],
    ['trade', '交易', '駅装飾'],
    ['farm', '農業', '農場装飾'],
    ['museum', '収集', '博物館展示'],
    ['town', '街づくり', '街の記念碑'],
] as const;
const milestones = [10, 25, 50, 100, 250, 500, 1000, 2500] as const;

export const achievementMaster: AchievementMasterEntry[] = achievementCategories.flatMap(([category, label, rewardHint]) => milestones.map((milestone) => ({
    id: `achievement_${category}_${milestone}`,
    nameJa: `${label}の軌跡 ${milestone}`,
    category,
    milestone,
    rewardHint,
    assetKey: `achievement/${category}/${milestone}`,
    status: 'PREPARED' as const,
})));
