export type FishContentStatus = 'IDEA' | 'CONCEPT' | 'PREPARED' | 'LIVE';
export type FishOrigin = 'real' | 'fantasy';
export type FishHabitat = 'freshwater' | 'river' | 'lake' | 'brackish' | 'coastal' | 'offshore' | 'deepsea';
export type FishUseTag = 'trade' | 'cooking' | 'museum' | 'request' | 'aquarium';

export type FishMasterEntry = {
    id: string;
    nameJa: string;
    origin: FishOrigin;
    habitat: FishHabitat;
    rarityTier: 1 | 2 | 3 | 4 | 5;
    releaseGroup: string;
    useTags: FishUseTag[];
    assetKey: string;
    status: FishContentStatus;
};

/**
 * Master catalog for current and future LIFE QUEST fish.
 *
 * LIVE = already part of the current 12-fish save/gameplay model.
 * PREPARED = dormant future content. It must not enter drop tables, saved inventory,
 * collection totals, or Chapter requirements until a release/migration is designed.
 *
 * assetKey is a stable logical key only. Future images can be attached later without
 * changing the fish ID stored by game systems.
 */
const fishRows = [
    ['medaka', 'メダカ', 'real', 'freshwater', 1, 'starter_pond', 'trade,museum,request,aquarium', 'LIVE'],
    ['funa', 'フナ', 'real', 'freshwater', 1, 'starter_pond', 'trade,cooking,museum,request', 'LIVE'],
    ['koi', 'コイ', 'real', 'freshwater', 2, 'starter_pond', 'trade,museum,request,aquarium', 'LIVE'],
    ['bass', 'ブラックバス', 'real', 'freshwater', 2, 'starter_pond', 'trade,cooking,museum,request', 'LIVE'],
    ['aji', 'アジ', 'real', 'coastal', 1, 'starter_coast', 'trade,cooking,museum,request', 'LIVE'],
    ['saba', 'サバ', 'real', 'coastal', 1, 'starter_coast', 'trade,cooking,museum,request', 'LIVE'],
    ['tai', 'タイ', 'real', 'coastal', 3, 'starter_coast', 'trade,cooking,museum,request', 'LIVE'],
    ['salmon', 'サケ', 'real', 'river', 3, 'starter_river', 'trade,cooking,museum,request', 'LIVE'],
    ['eel', 'ウナギ', 'real', 'river', 3, 'starter_river', 'trade,cooking,museum,request', 'LIVE'],
    ['kingyo', '金魚', 'real', 'freshwater', 3, 'starter_pond', 'trade,museum,request,aquarium', 'LIVE'],
    ['rainbowTrout', 'ニジマス', 'real', 'river', 4, 'starter_river', 'trade,cooking,museum,request,aquarium', 'LIVE'],
    ['moonKoi', '月影ゴイ', 'fantasy', 'freshwater', 5, 'starter_pond', 'trade,museum,request,aquarium', 'LIVE'],
    ['ayu', 'アユ', 'real', 'river', 2, 'river_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['iwana', 'イワナ', 'real', 'river', 3, 'mountain_stream', 'trade,cooking,museum,request,aquarium', 'PREPARED'],
    ['yamame', 'ヤマメ', 'real', 'river', 3, 'mountain_stream', 'trade,cooking,museum,request,aquarium', 'PREPARED'],
    ['amago', 'アマゴ', 'real', 'river', 3, 'mountain_stream', 'trade,cooking,museum,request,aquarium', 'PREPARED'],
    ['ito', 'イトウ', 'real', 'river', 5, 'northern_river', 'trade,museum,request,aquarium', 'PREPARED'],
    ['wakasagi', 'ワカサギ', 'real', 'lake', 2, 'snow_lake', 'trade,cooking,museum,request', 'PREPARED'],
    ['ugui', 'ウグイ', 'real', 'river', 1, 'river_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['oikawa', 'オイカワ', 'real', 'river', 1, 'river_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['kawamutsu', 'カワムツ', 'real', 'river', 1, 'river_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['tanago', 'タナゴ', 'real', 'freshwater', 2, 'wetland_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['dojo', 'ドジョウ', 'real', 'freshwater', 2, 'wetland_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['namazu', 'ナマズ', 'real', 'freshwater', 3, 'wetland_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['raigyo', 'ライギョ', 'real', 'freshwater', 3, 'wetland_1', 'trade,museum,request', 'PREPARED'],
    ['bluegill', 'ブルーギル', 'real', 'freshwater', 1, 'lake_1', 'trade,museum,request', 'PREPARED'],
    ['hasu', 'ハス', 'real', 'freshwater', 2, 'lake_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['nigoi', 'ニゴイ', 'real', 'river', 2, 'river_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['gengorobuna', 'ゲンゴロウブナ', 'real', 'freshwater', 2, 'lake_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['honmoroko', 'ホンモロコ', 'real', 'freshwater', 3, 'lake_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['kajika', 'カジカ', 'real', 'river', 2, 'mountain_stream', 'trade,cooking,museum,request', 'PREPARED'],
    ['ayukake', 'アユカケ', 'real', 'river', 4, 'mountain_stream', 'trade,museum,request,aquarium', 'PREPARED'],
    ['mahaze', 'マハゼ', 'real', 'brackish', 1, 'estuary_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['chichibu', 'チチブ', 'real', 'brackish', 1, 'estuary_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['bora', 'ボラ', 'real', 'brackish', 1, 'estuary_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['sayori', 'サヨリ', 'real', 'coastal', 2, 'coast_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['tobiuo', 'トビウオ', 'real', 'offshore', 3, 'offshore_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['iwashi', 'イワシ', 'real', 'coastal', 1, 'coast_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['sanma', 'サンマ', 'real', 'offshore', 2, 'offshore_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['katsuo', 'カツオ', 'real', 'offshore', 3, 'offshore_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['maguro', 'マグロ', 'real', 'offshore', 5, 'open_sea', 'trade,cooking,museum,request', 'PREPARED'],
    ['buri', 'ブリ', 'real', 'offshore', 4, 'offshore_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['kanpachi', 'カンパチ', 'real', 'offshore', 4, 'offshore_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['hiramasa', 'ヒラマサ', 'real', 'offshore', 4, 'offshore_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['sawara', 'サワラ', 'real', 'coastal', 3, 'coast_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['tachiuo', 'タチウオ', 'real', 'coastal', 3, 'night_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['isaki', 'イサキ', 'real', 'coastal', 2, 'reef_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['suzuki', 'スズキ', 'real', 'brackish', 3, 'estuary_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['kurodai', 'クロダイ', 'real', 'coastal', 3, 'reef_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['ishidai', 'イシダイ', 'real', 'coastal', 4, 'reef_1', 'trade,cooking,museum,request,aquarium', 'PREPARED'],
    ['ishigakidai', 'イシガキダイ', 'real', 'coastal', 4, 'reef_1', 'trade,cooking,museum,request,aquarium', 'PREPARED'],
    ['hamadai', 'ハマダイ', 'real', 'deepsea', 4, 'deep_sea_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['kinmedai', 'キンメダイ', 'real', 'deepsea', 4, 'deep_sea_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['nodoguro', 'ノドグロ', 'real', 'deepsea', 4, 'deep_sea_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['kawahagi', 'カワハギ', 'real', 'coastal', 2, 'reef_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['umazurahagi', 'ウマヅラハギ', 'real', 'coastal', 2, 'reef_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['fugu', 'フグ', 'real', 'coastal', 3, 'reef_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['torafugu', 'トラフグ', 'real', 'coastal', 4, 'reef_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['karei', 'カレイ', 'real', 'coastal', 2, 'sandy_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['hirame', 'ヒラメ', 'real', 'coastal', 3, 'sandy_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['anko', 'アンコウ', 'real', 'deepsea', 4, 'deep_sea_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['mebaru', 'メバル', 'real', 'coastal', 2, 'rocky_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['kasago', 'カサゴ', 'real', 'coastal', 2, 'rocky_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['soi', 'ソイ', 'real', 'coastal', 3, 'northern_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['ainame', 'アイナメ', 'real', 'coastal', 2, 'rocky_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['hatahata', 'ハタハタ', 'real', 'coastal', 3, 'northern_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['hokke', 'ホッケ', 'real', 'coastal', 2, 'northern_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['tara', 'タラ', 'real', 'deepsea', 3, 'northern_sea', 'trade,cooking,museum,request', 'PREPARED'],
    ['sukesodara', 'スケトウダラ', 'real', 'deepsea', 2, 'northern_sea', 'trade,cooking,museum,request', 'PREPARED'],
    ['sakuramasu', 'サクラマス', 'real', 'river', 4, 'northern_river', 'trade,cooking,museum,request,aquarium', 'PREPARED'],
    ['ginzake', 'ギンザケ', 'real', 'offshore', 3, 'northern_sea', 'trade,cooking,museum,request', 'PREPARED'],
    ['mutsu', 'ムツ', 'real', 'deepsea', 3, 'deep_sea_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['houbou', 'ホウボウ', 'real', 'coastal', 3, 'sandy_coast', 'trade,cooking,museum,request,aquarium', 'PREPARED'],
    ['anago', 'アナゴ', 'real', 'coastal', 3, 'night_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['hamo', 'ハモ', 'real', 'coastal', 4, 'night_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['utsubo', 'ウツボ', 'real', 'coastal', 3, 'reef_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['kisu', 'キス', 'real', 'coastal', 1, 'sandy_coast', 'trade,cooking,museum,request', 'PREPARED'],
    ['kamasu', 'カマス', 'real', 'coastal', 2, 'coast_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['konoshiro', 'コノシロ', 'real', 'coastal', 2, 'coast_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['sappa', 'サッパ', 'real', 'coastal', 1, 'coast_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['nishin', 'ニシン', 'real', 'offshore', 2, 'northern_sea', 'trade,cooking,museum,request', 'PREPARED'],
    ['akoudai', 'アコウダイ', 'real', 'deepsea', 4, 'deep_sea_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['ryuguunotsukai', 'リュウグウノツカイ', 'real', 'deepsea', 5, 'abyss_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['coelacanth', 'シーラカンス', 'real', 'deepsea', 5, 'abyss_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['manbou', 'マンボウ', 'real', 'offshore', 4, 'open_sea', 'trade,museum,request,aquarium', 'PREPARED'],
    ['nekozame', 'ネコザメ', 'real', 'coastal', 4, 'reef_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['jinbeizame', 'ジンベエザメ', 'real', 'offshore', 5, 'open_sea', 'museum,request,aquarium', 'PREPARED'],
    ['shumokuzame', 'シュモクザメ', 'real', 'offshore', 5, 'open_sea', 'trade,museum,request,aquarium', 'PREPARED'],
    ['akaei', 'アカエイ', 'real', 'brackish', 3, 'estuary_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['manta', 'マンタ', 'real', 'offshore', 5, 'open_sea', 'museum,request,aquarium', 'PREPARED'],
    ['chouchouuo', 'チョウチョウウオ', 'real', 'coastal', 3, 'coral_reef', 'trade,museum,request,aquarium', 'PREPARED'],
    ['kakurekumanomi', 'カクレクマノミ', 'real', 'coastal', 3, 'coral_reef', 'trade,museum,request,aquarium', 'PREPARED'],
    ['harisenbon', 'ハリセンボン', 'real', 'coastal', 3, 'coral_reef', 'trade,museum,request,aquarium', 'PREPARED'],
    ['minokasago', 'ミノカサゴ', 'real', 'coastal', 4, 'coral_reef', 'trade,museum,request,aquarium', 'PREPARED'],
    ['kinchakudai', 'キンチャクダイ', 'real', 'coastal', 3, 'coral_reef', 'trade,museum,request,aquarium', 'PREPARED'],
    ['budai', 'ブダイ', 'real', 'coastal', 3, 'coral_reef', 'trade,cooking,museum,request,aquarium', 'PREPARED'],
    ['kue', 'クエ', 'real', 'coastal', 5, 'reef_1', 'trade,cooking,museum,request', 'PREPARED'],
    ['chouchinankou', 'チョウチンアンコウ', 'real', 'deepsea', 5, 'abyss_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['hadakaiwashi', 'ハダカイワシ', 'real', 'deepsea', 3, 'deep_sea_1', 'trade,museum,request,aquarium', 'PREPARED'],
    ['mitsukurizame', 'ミツクリザメ', 'real', 'deepsea', 5, 'abyss_1', 'museum,request,aquarium', 'PREPARED'],
] as const;

export const fishMaster: FishMasterEntry[] = fishRows.map(
    ([id, nameJa, origin, habitat, rarityTier, releaseGroup, useTagCsv, status]) => ({
        id,
        nameJa,
        origin,
        habitat,
        rarityTier,
        releaseGroup,
        useTags: useTagCsv.split(',') as FishUseTag[],
        assetKey: `fish/${id}`,
        status,
    }),
);

export const liveFishMaster = fishMaster.filter((fish) => fish.status === 'LIVE');
export const preparedFishMaster = fishMaster.filter((fish) => fish.status === 'PREPARED');

export const fishMasterSummary = {
    total: fishMaster.length,
    live: liveFishMaster.length,
    prepared: preparedFishMaster.length,
} as const;
