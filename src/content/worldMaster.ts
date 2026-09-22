export type RegionMasterEntry = {
    id: string;
    nameJa: string;
    biome: string;
    roleTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

export type BuildingMasterEntry = {
    id: string;
    nameJa: string;
    category: string;
    systemTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

export type EnvironmentMasterEntry = {
    id: string;
    nameJa: string;
    kind: 'weather' | 'season_event';
    effectTags: string[];
    season?: 'spring' | 'summer' | 'autumn' | 'winter';
    assetKey: string;
    status: 'PREPARED';
};

const regionRows = [
    ['home_town', '開拓の街', 'temperate_town', ['hub', 'building', 'npc', 'trade']],
    ['starter_pond', '町外れの池', 'pond', ['fishing', 'aquarium', 'request']],
    ['silver_river', '銀流川', 'river', ['fishing', 'exploration', 'trade']],
    ['greenwood_forest', '緑風の森', 'forest', ['exploration', 'wood', 'herb']],
    ['ironridge_mine', '黒鉄鉱山', 'mine', ['mining', 'ore', 'ruin']],
    ['ancient_ruins', '古代遺跡', 'ruins', ['exploration', 'relic', 'boss']],
    ['mirror_lake', '鏡湖', 'lake', ['fishing', 'tourism', 'aquarium']],
    ['mist_wetland', '霧葦湿地', 'wetland', ['fishing', 'herb', 'rare']],
    ['sunset_estuary', '夕凪河口', 'estuary', ['fishing', 'trade', 'port']],
    ['stone_reef', '石花岩礁', 'rocky_coast', ['fishing', 'shell', 'trade']],
    ['white_sand_coast', '白砂海岸', 'sandy_coast', ['fishing', 'tourism', 'salt']],
    ['blue_offshore', '蒼海沖', 'offshore', ['fishing', 'shipping', 'rare']],
    ['harbor_city', '潮風港町', 'port_city', ['trade', 'station', 'market', 'fishing']],
    ['north_coast', '北風海岸', 'cold_coast', ['fishing', 'winter', 'trade']],
    ['north_river', '北境大河', 'cold_river', ['fishing', 'exploration', 'rare']],
    ['snow_lake', '白銀湖', 'frozen_lake', ['fishing', 'winter', 'rare']],
    ['snow_mountain', '雪冠山脈', 'snow_mountain', ['mining', 'exploration', 'winter']],
    ['hot_spring_village', '湯煙温泉郷', 'hot_spring', ['tourism', 'npc', 'cooking']],
    ['ember_volcano', '紅蓮火山', 'volcano', ['mining', 'rare', 'boss']],
    ['wind_highland', '風渡る高原', 'highland', ['farm', 'livestock', 'wind']],
    ['sun_dune', '陽炎砂漠', 'desert', ['exploration', 'relic', 'rare']],
    ['oasis_market', '碧泉オアシス', 'oasis', ['trade', 'farm', 'npc']],
    ['lost_city', '忘却古代都市', 'ancient_city', ['ruin', 'museum', 'boss']],
    ['underground_canal', '地下水路都市', 'underground', ['fishing', 'ruin', 'trade']],
    ['deep_sea', '蒼黒深海', 'deep_sea', ['fishing', 'research', 'rare']],
    ['abyss', '星無き深淵', 'abyss', ['fishing', 'boss', 'legendary']],
    ['coral_reef', '七彩珊瑚海', 'coral_reef', ['fishing', 'aquarium', 'tourism']],
    ['island_chain', '風待ち諸島', 'islands', ['shipping', 'fishing', 'exploration']],
    ['grain_village', '麦穂農村', 'farmland', ['farm', 'food', 'trade']],
    ['forge_city', '炉火工業都市', 'industrial_city', ['craft', 'research', 'trade']],
    ['royal_capital', '王都アルカ', 'capital', ['market', 'museum', 'npc', 'quest']],
    ['sky_island', '天空浮島', 'sky', ['exploration', 'legendary', 'research']],
] as const;

export const regionMaster: RegionMasterEntry[] = regionRows.map(([id, nameJa, biome, roleTags]) => ({
    id,
    nameJa,
    biome,
    roleTags: [...roleTags],
    assetKey: `region/${id}`,
    status: 'PREPARED',
}));

const buildingGroups = [
    { id: 'production', entries: [['sawmill', '製材所'], ['smelter', '精錬所'], ['foundry', '鋳造所'], ['mill', '製粉所'], ['dairy', '乳製品工房'], ['smokehouse', '燻製小屋']] },
    { id: 'commerce', entries: [['market', '市場'], ['trading_post', '交易所'], ['fish_market', '魚市場'], ['general_store', '雑貨店'], ['auction_house', '競売所'], ['warehouse_shop', '問屋']] },
    { id: 'transport', entries: [['station', '中央駅'], ['freight_depot', '貨物駅'], ['harbor', '港'], ['shipyard', '造船所'], ['coach_house', '馬車宿'], ['airship_dock', '飛空艇桟橋']] },
    { id: 'culture', entries: [['museum', '博物館'], ['aquarium', '水族館'], ['library', '図書館'], ['gallery', '美術館'], ['clock_tower', '時計塔'], ['monument_plaza', '記念碑広場']] },
    { id: 'research', entries: [['laboratory', '研究所'], ['observatory', '天文台'], ['geology_lab', '地質研究室'], ['marine_lab', '海洋研究所'], ['agri_lab', '農業研究所'], ['engineering_lab', '技術開発棟']] },
    { id: 'life', entries: [['inn', '宿屋'], ['restaurant', '食堂'], ['bakery', 'パン屋'], ['bathhouse', '湯屋'], ['house', 'マイハウス'], ['community_hall', '集会所']] },
    { id: 'farm', entries: [['farmhouse', '農家'], ['barn', '畜舎'], ['greenhouse', '温室'], ['orchard', '果樹園'], ['apiary', '養蜂場'], ['fish_farm', '養殖場']] },
    { id: 'adventure', entries: [['guild', '冒険者ギルド'], ['equipment_shop', '装備店'], ['camp', '野営地'], ['expedition_office', '探索隊本部'], ['boss_gate', '討伐門'], ['ruin_archive', '遺跡資料館']] },
] as const;

export const buildingMaster: BuildingMasterEntry[] = buildingGroups.flatMap((group) => group.entries.map(([slug, nameJa]) => ({
    id: `building_${slug}`,
    nameJa,
    category: group.id,
    systemTags: [group.id, slug],
    assetKey: `building/${slug}`,
    status: 'PREPARED' as const,
})));

const weatherRows = [
    ['clear', '快晴', ['visibility', 'travel']],
    ['cloudy', '曇天', ['neutral']],
    ['light_rain', '小雨', ['fishing', 'farm']],
    ['heavy_rain', '大雨', ['river', 'travel_risk']],
    ['thunderstorm', '雷雨', ['rare_fish', 'travel_risk']],
    ['fog', '濃霧', ['exploration', 'rare']],
    ['strong_wind', '強風', ['shipping', 'wind_power']],
    ['calm', '凪', ['offshore', 'shipping']],
    ['snow', '雪', ['winter', 'crop']],
    ['blizzard', '吹雪', ['winter', 'travel_risk']],
    ['heatwave', '猛暑', ['summer', 'crop']],
    ['cold_wave', '寒波', ['winter', 'frozen_lake']],
    ['full_moon', '満月夜', ['night', 'legendary_fish']],
    ['new_moon', '新月夜', ['night', 'deepsea']],
    ['meteor_shower', '流星群', ['rare', 'research']],
    ['aurora', 'オーロラ', ['north', 'legendary']],
    ['red_tide', '赤潮', ['coast', 'market']],
    ['spring_tide', '大潮', ['coast', 'fishing']],
    ['dry_spell', '日照り', ['farm', 'water']],
    ['rainbow', '虹', ['tourism', 'rare']],
] as const;

export const weatherMaster: EnvironmentMasterEntry[] = weatherRows.map(([id, nameJa, effectTags]) => ({
    id: `weather_${id}`,
    nameJa,
    kind: 'weather',
    effectTags: [...effectTags],
    assetKey: `environment/weather/${id}`,
    status: 'PREPARED',
}));

const seasonGroups = [
    { season: 'spring', entries: [['cherry_festival', '桜まつり'], ['river_opening', '渓流解禁'], ['seed_fair', '種苗市'], ['bee_swarm', '蜜蜂の季節'], ['spring_migration', '春の魚群'], ['ruin_bloom', '遺跡花の開花']] },
    { season: 'summer', entries: [['firefly_night', '蛍の夜'], ['summer_festival', '夏祭り'], ['tuna_run', '大型回遊魚来訪'], ['storm_season', '嵐の季節'], ['harvest_early', '夏野菜豊作'], ['deepsea_window', '深海航路開放']] },
    { season: 'autumn', entries: [['salmon_run', '鮭の遡上'], ['harvest_festival', '収穫祭'], ['mushroom_market', '森の恵み市'], ['ore_rush', '秋の鉱脈祭'], ['moon_viewing', '月見の夜'], ['merchant_fair', '大交易市']] },
    { season: 'winter', entries: [['ice_fishing', '氷上釣り'], ['snow_festival', '雪灯り祭'], ['northern_train', '北方特急運行'], ['hot_spring_week', '温泉週間'], ['aurora_watch', '極光観測会'], ['year_end_market', '歳末市場']] },
] as const;

export const seasonEventMaster: EnvironmentMasterEntry[] = seasonGroups.flatMap((group) => group.entries.map(([slug, nameJa]) => ({
    id: `season_${group.season}_${slug}`,
    nameJa,
    kind: 'season_event' as const,
    effectTags: [group.season, slug],
    season: group.season,
    assetKey: `environment/season/${group.season}/${slug}`,
    status: 'PREPARED' as const,
})));
