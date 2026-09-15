export type Expedition = { site: '森' | '山' | '遺跡'; startedAt: number; returnsAt: number };
export type LifeQuestSave = {
  version: 2;
  depth: number; energy: number; stone: number; iron: number; copper: number; wood: number; crystal: number;
  ingots: number; copperIngots: number; gears: number; lanterns: number;
  fishCaught: number; fishRecords: Record<string, number>; bait: number;
  discoveries: number; loot: number; explorationTickets: number; expedition: Expedition | null;
  xp: number; gold: number; knowledge: number; chests: number; bossHp: number; bossMax: number;
  mineLevel: number; workshopLevel: number; rocksBroken: number; casts: number; crafted: number; chestsOpened: number;
  exploredLocations: Record<string, number>; guildRewardClaimed: boolean; discoveredItems: string[]; eventCards: string[];
  hallOfFame: Record<string, number>; updatedAt: number;
};
const KEY = 'life-quest-save-v1';
const initialSave: LifeQuestSave = {
  version: 2, depth: 1, energy: 12, stone: 6, iron: 3, copper: 3, wood: 2, crystal: 0,
  ingots: 0, copperIngots: 0, gears: 0, lanterns: 0, fishCaught: 0, fishRecords: {}, bait: 3,
  discoveries: 0, loot: 0, explorationTickets: 1, expedition: null, xp: 0, gold: 120,
  knowledge: 0, chests: 1, bossHp: 600, bossMax: 600, mineLevel: 1, workshopLevel: 1,
  rocksBroken: 0, casts: 0, crafted: 0, chestsOpened: 0, exploredLocations: {}, guildRewardClaimed: false,
  discoveredItems: ['stone', 'iron', 'copper', 'wood'], eventCards: [], hallOfFame: {}, updatedAt: Date.now()
};
export interface SaveRepository { load(): LifeQuestSave; save(next: LifeQuestSave): LifeQuestSave; }
export class LocalStorageSaveRepository implements SaveRepository {
  load(): LifeQuestSave {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) as Partial<LifeQuestSave> : {};
      const migrated = { ...initialSave, ...parsed, version: 2 as const };
      return { ...migrated, bossMax: 600, bossHp: Number(parsed.version) === 1 && parsed.bossHp === 300 ? 600 : migrated.bossHp,
        fishRecords: { ...parsed.fishRecords }, exploredLocations: { ...parsed.exploredLocations },
        discoveredItems: parsed.discoveredItems ?? initialSave.discoveredItems, eventCards: parsed.eventCards ?? [], hallOfFame: parsed.hallOfFame ?? {} };
    } catch { return { ...initialSave }; }
  }
  save(next: LifeQuestSave): LifeQuestSave {
    const cards = new Set(next.eventCards);
    if (next.rocksBroken + next.crafted + next.fishCaught + next.discoveries > 0) cards.add('最初の一歩');
    if (next.rocksBroken > 0 || next.crafted > 0) cards.add('開拓者');
    if (next.fishCaught > 0) cards.add('最初の一匹');
    if (next.discoveries > 0) cards.add('世界の外へ');
    if (Object.keys(next.fishRecords).length >= 5) cards.add('水辺の収集家');
    if (next.bossHp <= 0) cards.add('城主討伐者');
    const hall = { ...next.hallOfFame };
    if (!hall.chapter1 && cards.size >= 3) hall.chapter1 = Date.now();
    if (!hall.chapter2 && hall.chapter1 && next.mineLevel >= 3 && next.workshopLevel >= 3 && next.discoveredItems.length >= 9) hall.chapter2 = Date.now();
    if (!hall.chapter3 && hall.chapter2 && Object.keys(next.fishRecords).length >= 12 && next.discoveries >= 10) hall.chapter3 = Date.now();
    const versioned = { ...next, eventCards: [...cards], hallOfFame: hall, version: 2 as const, updatedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(versioned));
    window.dispatchEvent(new CustomEvent('lifequest:save', { detail: versioned }));
    return versioned;
  }
}
export const saveRepository: SaveRepository = new LocalStorageSaveRepository();
export const loadSave = () => saveRepository.load();
export const saveGame = (next: LifeQuestSave) => saveRepository.save(next);
export function updateSave(updater: (current: LifeQuestSave) => LifeQuestSave) { return saveGame(updater(loadSave())); }
