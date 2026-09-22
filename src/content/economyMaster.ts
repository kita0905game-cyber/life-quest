export type EconomyStatus = 'PREPARED' | 'LIVE';

export type MaterialMasterEntry = {
    id: string;
    nameJa: string;
    category: string;
    useTags: string[];
    assetKey: string;
    status: EconomyStatus;
};

export type AgricultureMasterEntry = {
    id: string;
    nameJa: string;
    category: string;
    seasonTags: string[];
    useTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

export type RecipeMasterEntry = {
    id: string;
    nameJa: string;
    category: string;
    inputHint: string;
    outputHint: string;
    assetKey: string;
    status: 'PREPARED';
};

export type TradeGoodMasterEntry = {
    id: string;
    nameJa: string;
    category: string;
    demandTags: string[];
    assetKey: string;
    status: 'PREPARED';
};

const liveMaterialRows = [
    ['stone', '石材', 'construction', ['building', 'craft', 'trade']],
    ['ironOre', '鉄鉱石', 'ore', ['smelt', 'trade', 'research']],
    ['copperOre', '銅鉱石', 'ore', ['smelt', 'trade', 'research']],
    ['wood', '木材', 'organic', ['building', 'craft', 'fuel']],
    ['crystal', 'クリスタル', 'gem', ['upgrade', 'research', 'trade']],
    ['ironIngot', '鉄インゴット', 'processed', ['craft', 'building', 'trade']],
    ['copperIngot', '銅インゴット', 'processed', ['craft', 'building', 'trade']],
    ['gear', '歯車', 'component', ['machine', 'building', 'trade']],
    ['lantern', '開拓ランタン', 'component', ['explore', 'building', 'trade']],
] as const;

const futureMaterialGroups = [
    { category: 'ore', entries: [['coal', '石炭'], ['silver_ore', '銀鉱石'], ['gold_ore', '金鉱石'], ['tin_ore', '錫鉱石'], ['zinc_ore', '亜鉛鉱石'], ['lead_ore', '鉛鉱石'], ['bauxite', 'ボーキサイト'], ['titanium_ore', 'チタン鉱石'], ['mythril_ore', 'ミスリル鉱石']] },
    { category: 'gem', entries: [['quartz', '水晶'], ['ruby', 'ルビー'], ['sapphire', 'サファイア'], ['emerald', 'エメラルド'], ['topaz', 'トパーズ'], ['amethyst', 'アメジスト'], ['opal', 'オパール'], ['garnet', 'ガーネット'], ['star_crystal', '星晶石']] },
    { category: 'construction', entries: [['clay', '粘土'], ['sand', '砂'], ['limestone', '石灰石'], ['granite', '花崗岩'], ['marble', '大理石'], ['slate', '粘板岩'], ['basalt', '玄武岩'], ['glass', 'ガラス'], ['brick', 'レンガ']] },
    { category: 'organic', entries: [['hardwood', '硬木'], ['bamboo', '竹材'], ['resin', '樹脂'], ['fiber', '植物繊維'], ['leather', '革'], ['wool', '羊毛'], ['beeswax', '蜜蝋'], ['rubber_sap', '樹液ゴム']] },
    { category: 'relic', entries: [['ancient_coin', '古代硬貨'], ['ruin_shard', '遺跡片'], ['old_circuit', '古代回路'], ['sealed_tablet', '封印石板'], ['fossil_fragment', '化石片'], ['royal_fragment', '王家の欠片'], ['star_fragment', '星の欠片'], ['abyss_scale', '深淵の鱗']] },
    { category: 'industrial', entries: [['steel_ingot', '鋼インゴット'], ['bronze_ingot', '青銅インゴット'], ['brass_ingot', '真鍮インゴット'], ['wire', '導線'], ['bearing', 'ベアリング'], ['spring', 'ばね'], ['precision_gear', '精密歯車'], ['machine_frame', '機械フレーム']] },
] as const;

export const materialMaster: MaterialMasterEntry[] = [
    ...liveMaterialRows.map(([id, nameJa, category, useTags]) => ({ id, nameJa, category, useTags: [...useTags], assetKey: `material/${id}`, status: 'LIVE' as const })),
    ...futureMaterialGroups.flatMap((group) => group.entries.map(([id, nameJa]) => ({ id, nameJa, category: group.category, useTags: ['craft', 'trade', 'research'], assetKey: `material/${id}`, status: 'PREPARED' as const }))),
];

const agricultureGroups = [
    { category: 'grain', season: ['spring', 'autumn'], entries: [['wheat', '小麦'], ['rice', '米'], ['barley', '大麦'], ['rye', 'ライ麦'], ['corn', 'トウモロコシ'], ['buckwheat', 'そば']] },
    { category: 'vegetable', season: ['spring', 'summer'], entries: [['tomato', 'トマト'], ['potato', 'ジャガイモ'], ['carrot', 'ニンジン'], ['onion', 'タマネギ'], ['cabbage', 'キャベツ'], ['cucumber', 'キュウリ']] },
    { category: 'vegetable', season: ['autumn', 'winter'], entries: [['pumpkin', 'カボチャ'], ['daikon', 'ダイコン'], ['spinach', 'ホウレンソウ'], ['burdock', 'ゴボウ'], ['lotus_root', 'レンコン'], ['sweet_potato', 'サツマイモ']] },
    { category: 'fruit', season: ['summer'], entries: [['strawberry', 'イチゴ'], ['watermelon', 'スイカ'], ['peach', 'モモ'], ['grape', 'ブドウ'], ['melon', 'メロン'], ['blueberry', 'ブルーベリー']] },
    { category: 'fruit', season: ['autumn', 'winter'], entries: [['apple', 'リンゴ'], ['pear', 'ナシ'], ['persimmon', 'カキ'], ['mandarin', 'ミカン'], ['lemon', 'レモン'], ['chestnut', 'クリ']] },
    { category: 'herb', season: ['spring', 'summer'], entries: [['mint', 'ミント'], ['basil', 'バジル'], ['rosemary', 'ローズマリー'], ['lavender', 'ラベンダー'], ['chamomile', 'カモミール'], ['sage', 'セージ']] },
    { category: 'flower', season: ['spring', 'summer'], entries: [['sunflower', 'ヒマワリ'], ['tulip', 'チューリップ'], ['rose', 'バラ'], ['lily', 'ユリ'], ['cosmos', 'コスモス'], ['hydrangea', 'アジサイ']] },
    { category: 'animal', season: ['all'], entries: [['milk', '牛乳'], ['egg', '卵'], ['goat_milk', '山羊乳'], ['wool_product', '羊毛'], ['honey', '蜂蜜'], ['butter_raw', '生乳脂']] },
    { category: 'specialty', season: ['all'], entries: [['tea_leaf', '茶葉'], ['coffee_bean', 'コーヒー豆'], ['cacao', 'カカオ'], ['sugarcane', 'サトウキビ'], ['olive', 'オリーブ'], ['chili', '唐辛子']] },
    { category: 'fantasy', season: ['special'], entries: [['moon_herb', '月光草'], ['star_berry', '星苺'], ['frost_grape', '霜葡萄'], ['ember_pepper', '火種唐辛子'], ['sky_wheat', '空麦'], ['crystal_flower', '晶花']] },
] as const;

export const agricultureMaster: AgricultureMasterEntry[] = agricultureGroups.flatMap((group) => group.entries.map(([id, nameJa]) => ({
    id: `agri_${id}`,
    nameJa,
    category: group.category,
    seasonTags: [...group.season],
    useTags: ['cooking', 'trade', 'request'],
    assetKey: `agriculture/${id}`,
    status: 'PREPARED' as const,
})));

const recipeGroups = [
    { category: 'bakery', entries: [['bread', '素朴なパン', '小麦→小麦粉', 'パン'], ['baguette', 'バゲット', '小麦粉+塩', 'パン'], ['croissant', 'クロワッサン', '小麦粉+バター', '焼菓子'], ['apple_pie', 'アップルパイ', '小麦粉+リンゴ', '菓子'], ['honey_toast', '蜂蜜トースト', 'パン+蜂蜜', '料理'], ['star_bread', '星麦パン', '空麦+蜂蜜', '希少料理']] },
    { category: 'dairy', entries: [['butter', 'バター', '牛乳', '乳製品'], ['cheese', 'チーズ', '牛乳', '乳製品'], ['yogurt', 'ヨーグルト', '牛乳', '乳製品'], ['cream', '生クリーム', '牛乳', '乳製品'], ['ice_cream', 'アイスクリーム', '牛乳+果実', '菓子'], ['aged_cheese', '熟成チーズ', 'チーズ+時間', '交易品']] },
    { category: 'fish', entries: [['grilled_fish', '魚の塩焼き', '魚+塩', '料理'], ['fish_stew', '魚介シチュー', '魚+野菜', '料理'], ['smoked_fish', '燻製魚', '魚+木材', '保存食'], ['dried_fish', '干物', '魚+塩', '保存食'], ['sushi_plate', '寿司盛り', '魚+米', '高級料理'], ['legend_fish_dish', '幻魚の祝膳', '希少魚+米', '特別料理']] },
    { category: 'vegetable', entries: [['salad', '畑のサラダ', '野菜', '料理'], ['vegetable_soup', '野菜スープ', '野菜+水', '料理'], ['pickles', '漬物', '野菜+塩', '保存食'], ['curry', '開拓カレー', '野菜+香辛料', '料理'], ['roast_veg', '焼き野菜', '根菜', '料理'], ['hotpot', '山海鍋', '野菜+魚', '料理']] },
    { category: 'drink', entries: [['tea', '紅茶', '茶葉', '飲料'], ['coffee', 'コーヒー', 'コーヒー豆', '飲料'], ['lemonade', 'レモネード', 'レモン+砂糖', '飲料'], ['berry_juice', 'ベリージュース', '果実', '飲料'], ['herb_tea', 'ハーブティー', '薬草', '飲料'], ['moon_tea', '月光茶', '月光草', '希少飲料']] },
    { category: 'material', entries: [['steel_plate', '鋼板', '鋼インゴット', '工業材'], ['bronze_part', '青銅部品', '青銅インゴット', '部品'], ['wire_bundle', '導線束', '銅+導線', '部品'], ['bearing_unit', '軸受ユニット', 'ベアリング+鋼', '部品'], ['machine_core', '機械コア', '精密歯車+晶石', '高級部品'], ['rail_segment', 'レール材', '鋼板+木材', '鉄道資材']] },
    { category: 'tool', entries: [['pickaxe_kit', '採掘工具キット', '鉄+木材', '道具部品'], ['rod_kit', '釣竿キット', '木材+繊維', '道具部品'], ['lantern_kit', '探検灯キット', '銅+ガラス', '探索部品'], ['wagon_kit', '貨車整備キット', '鋼+歯車', '鉄道部品'], ['farm_kit', '農具キット', '鉄+木材', '農業部品'], ['museum_case', '展示ケース', 'ガラス+木材', '博物館設備']] },
    { category: 'preserve', entries: [['jam', '果実ジャム', '果実+砂糖', '保存食'], ['honey_jar', '蜂蜜瓶', '蜂蜜+ガラス', '交易品'], ['cheese_box', 'チーズ詰合せ', 'チーズ+木箱', '交易品'], ['smoked_meat', '燻製肉', '畜産物+木材', '保存食'], ['herb_mix', '乾燥ハーブ', '薬草', '交易品'], ['tea_box', '茶葉箱', '茶葉+木箱', '交易品']] },
    { category: 'luxury', entries: [['chocolate', 'チョコレート', 'カカオ+砂糖', '高級菓子'], ['fruit_tart', '果実タルト', '小麦+果実', '高級菓子'], ['royal_tea_set', '王都茶会セット', '茶+菓子', '高級品'], ['pearl_box', '真珠飾り箱', '貝素材+木材', '高級品'], ['gem_brooch', '宝石ブローチ', '宝石+金属', '高級品'], ['star_glass', '星晶ガラス器', '星晶石+ガラス', '伝説交易品']] },
    { category: 'expedition', entries: [['ration', '探索携行食', '穀物+保存食', '探索用品'], ['rope', '丈夫なロープ', '植物繊維', '探索用品'], ['torch', '松明', '木材+樹脂', '探索用品'], ['cold_pack', '寒冷地セット', '羊毛+保存食', '探索用品'], ['desert_pack', '砂漠セット', '水+保存食', '探索用品'], ['abyss_pack', '深淵調査セット', 'ランタン+希少部品', '高級探索用品']] },
] as const;

export const recipeMaster: RecipeMasterEntry[] = recipeGroups.flatMap((group) => group.entries.map(([slug, nameJa, inputHint, outputHint]) => ({
    id: `recipe_${slug}`,
    nameJa,
    category: group.category,
    inputHint,
    outputHint,
    assetKey: `recipe/${slug}`,
    status: 'PREPARED' as const,
})));

const tradeGroups = [
    { category: 'raw', entries: [['ore_crate', '鉱石木箱'], ['timber_bundle', '木材束'], ['stone_pallet', '石材パレット'], ['herb_bale', '薬草束'], ['wool_bale', '羊毛梱包'], ['salt_sack', '塩袋']] },
    { category: 'food', entries: [['grain_crate', '穀物箱'], ['fruit_crate', '果実箱'], ['fish_crate', '鮮魚箱'], ['smoked_box', '燻製詰合せ'], ['dairy_box', '乳製品箱'], ['bakery_box', '焼きたて便']] },
    { category: 'industrial', entries: [['ingot_load', 'インゴット積荷'], ['gear_case', '歯車ケース'], ['machine_parts', '機械部品箱'], ['rail_bundle', 'レール束'], ['tool_crate', '工具箱'], ['glass_case', 'ガラス製品箱']] },
    { category: 'luxury', entries: [['jewel_case', '宝石箱'], ['tea_chest', '高級茶箱'], ['chocolate_case', '菓子箱'], ['art_crate', '美術品木箱'], ['perfume_case', '香料箱'], ['royal_gift', '王都贈答品']] },
    { category: 'marine', entries: [['pearl_lot', '真珠取引箱'], ['coral_lot', '珊瑚工芸箱'], ['deepsea_sample', '深海標本箱'], ['salt_fish', '塩蔵魚箱'], ['seaweed_bale', '海藻束'], ['shell_case', '貝細工箱']] },
    { category: 'regional', entries: [['snow_goods', '雪国特産箱'], ['desert_spice', '砂漠香辛料箱'], ['hot_spring_goods', '温泉郷土産箱'], ['island_goods', '諸島特産箱'], ['highland_goods', '高原牧場箱'], ['forest_goods', '森林工芸箱']] },
    { category: 'research', entries: [['mineral_samples', '鉱物標本便'], ['botanical_samples', '植物標本便'], ['fish_samples', '魚類研究便'], ['ruin_samples', '遺跡資料便'], ['weather_instruments', '観測機器便'], ['prototype_parts', '試作部品便']] },
    { category: 'legendary', entries: [['star_relic_case', '星遺物封印箱'], ['abyss_relic_case', '深淵遺物封印箱'], ['royal_archive', '王家文書箱'], ['sky_island_goods', '天空島交易箱'], ['ancient_machine', '古代機械輸送箱'], ['masterwork_case', '名工作品箱']] },
] as const;

export const tradeGoodMaster: TradeGoodMasterEntry[] = tradeGroups.flatMap((group) => group.entries.map(([slug, nameJa]) => ({
    id: `trade_${slug}`,
    nameJa,
    category: group.category,
    demandTags: [group.category, 'station', 'market'],
    assetKey: `trade/${slug}`,
    status: 'PREPARED' as const,
})));
