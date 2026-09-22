export type TransportVehicleMasterEntry = {
    id: string;
    nameJa: string;
    class: string;
    capabilityTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

export type RouteMasterEntry = {
    id: string;
    nameJa: string;
    routeClass: string;
    destinationHint: string;
    cargoTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

const vehicleGroups = [
    { class: 'locomotive', entries: [['pioneer_steam', '開拓蒸気機関車'], ['hill_steam', '山岳蒸気機関車'], ['express_steam', '急行蒸気機関車'], ['diesel_freight', '貨物ディーゼル'], ['electric_express', '電気特急'], ['star_engine', '星晶機関車']] },
    { class: 'general_wagon', entries: [['small_boxcar', '小型有蓋車'], ['boxcar', '有蓋貨車'], ['large_boxcar', '大型有蓋車'], ['flatcar', '長物車'], ['secure_car', '貴重品輸送車'], ['museum_car', '標本輸送車']] },
    { class: 'bulk_wagon', entries: [['ore_hopper', '鉱石ホッパ車'], ['coal_hopper', '石炭ホッパ車'], ['stone_wagon', '石材貨車'], ['timber_wagon', '木材貨車'], ['grain_hopper', '穀物ホッパ車'], ['sand_hopper', '砂利ホッパ車']] },
    { class: 'cold_wagon', entries: [['fish_refrigerator', '鮮魚冷蔵車'], ['food_refrigerator', '食品冷蔵車'], ['flower_refrigerator', '花卉冷蔵車'], ['frozen_car', '冷凍貨車'], ['milk_tank', '牛乳タンク車'], ['ice_car', '氷雪輸送車']] },
    { class: 'special_wagon', entries: [['livestock_car', '家畜車'], ['tank_car', '液体タンク車'], ['machine_car', '大型機械車'], ['research_car', '研究車'], ['mail_car', '郵便車'], ['expedition_car', '探索隊車']] },
    { class: 'passenger', entries: [['local_coach', '普通客車'], ['tourist_coach', '観光客車'], ['sleeping_car', '寝台車'], ['dining_car', '食堂車'], ['observation_car', '展望車'], ['royal_car', '王都特別客車']] },
] as const;

export const transportVehicleMaster: TransportVehicleMasterEntry[] = vehicleGroups.flatMap((group) => group.entries.map(([slug, nameJa]) => ({
    id: `vehicle_${slug}`,
    nameJa,
    class: group.class,
    capabilityTags: [group.class, slug],
    assetKey: `transport/vehicle/${slug}`,
    status: 'PREPARED' as const,
})));

const routeRows = [
    ['harbor_line', '潮風港線', 'regional', '潮風港町', ['fish', 'salt', 'trade']],
    ['mountain_line', '黒鉄山岳線', 'freight', '黒鉄鉱山', ['ore', 'stone', 'coal']],
    ['forest_line', '緑風森林線', 'regional', '緑風の森', ['wood', 'herb', 'tourism']],
    ['lake_line', '鏡湖線', 'local', '鏡湖', ['fish', 'tourism', 'food']],
    ['farm_line', '麦穂農村線', 'freight', '麦穂農村', ['grain', 'food', 'livestock']],
    ['forge_line', '炉火工業線', 'freight', '炉火工業都市', ['metal', 'machine', 'tools']],
    ['capital_line', '王都本線', 'express', '王都アルカ', ['luxury', 'mail', 'passenger']],
    ['hotspring_line', '湯煙温泉線', 'tourist', '湯煙温泉郷', ['tourism', 'food', 'passenger']],
    ['north_coast_line', '北風海岸線', 'regional', '北風海岸', ['fish', 'winter', 'food']],
    ['snow_lake_line', '白銀湖線', 'seasonal', '白銀湖', ['fish', 'ice', 'tourism']],
    ['snow_mountain_line', '雪冠山脈線', 'freight', '雪冠山脈', ['ore', 'winter', 'research']],
    ['volcano_line', '紅蓮火山線', 'special', '紅蓮火山', ['ore', 'rare', 'research']],
    ['highland_line', '風渡高原線', 'regional', '風渡る高原', ['livestock', 'wool', 'food']],
    ['desert_line', '陽炎砂漠線', 'special', '陽炎砂漠', ['relic', 'spice', 'research']],
    ['oasis_line', '碧泉交易線', 'trade', '碧泉オアシス', ['spice', 'fruit', 'luxury']],
    ['lost_city_line', '忘却遺跡線', 'expedition', '忘却古代都市', ['relic', 'research', 'expedition']],
    ['underground_line', '地下水路線', 'special', '地下水路都市', ['fish', 'relic', 'machine']],
    ['island_ferry', '風待ち連絡航路', 'shipping', '風待ち諸島', ['fish', 'fruit', 'tourism']],
    ['coral_ferry', '七彩珊瑚航路', 'shipping', '七彩珊瑚海', ['aquarium', 'tourism', 'marine']],
    ['deepsea_research', '深海研究航路', 'research', '蒼黒深海', ['research', 'fish', 'rare']],
    ['north_express', '北境特急', 'express', '北境大河', ['passenger', 'fish', 'mail']],
    ['royal_freight', '王都貨物環状線', 'freight', '王都アルカ', ['trade', 'industrial', 'luxury']],
    ['sky_air_route', '天空交易航路', 'airship', '天空浮島', ['legendary', 'research', 'luxury']],
    ['grand_loop', '大陸環状線', 'late_game', '主要都市一周', ['all', 'passenger', 'trade']],
] as const;

export const routeMaster: RouteMasterEntry[] = routeRows.map(([id, nameJa, routeClass, destinationHint, cargoTags]) => ({
    id: `route_${id}`,
    nameJa,
    routeClass,
    destinationHint,
    cargoTags: [...cargoTags],
    assetKey: `transport/route/${id}`,
    status: 'PREPARED',
}));
