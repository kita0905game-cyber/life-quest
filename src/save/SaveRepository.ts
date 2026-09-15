export type LifeQuestSave = {
  version: 1;
  depth: number;
  energy: number;
  stone: number;
  iron: number;
  ingots: number;
  fishCaught: number;
  fishRecords: Record<string, number>;
  gears: number;
  discoveries: number;
  loot: number;
  xp: number;
  gold: number;
  bossHp: number;
  rocksBroken: number;
  casts: number;
  crafted: number;
  exploredLocations: Record<string, number>;
  guildRewardClaimed: boolean;
};

const KEY = 'life-quest-save-v1';

const initialSave: LifeQuestSave = {
  version: 1,
  depth: 1,
  energy: 12,
  stone: 0,
  iron: 0,
  ingots: 0,
  fishCaught: 0,
  fishRecords: {},
  gears: 0,
  discoveries: 0,
  loot: 0,
  xp: 0,
  gold: 120,
  bossHp: 300,
  rocksBroken: 0,
  casts: 0,
  crafted: 0,
  exploredLocations: {},
  guildRewardClaimed: false
};

export interface SaveRepository {
  load(): LifeQuestSave;
  save(next: LifeQuestSave): LifeQuestSave;
}

export class LocalStorageSaveRepository implements SaveRepository {
  load(): LifeQuestSave {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) as Partial<LifeQuestSave> : {};
      return {
        ...initialSave,
        ...parsed,
        version: 1,
        fishRecords: { ...initialSave.fishRecords, ...parsed.fishRecords },
        exploredLocations: { ...initialSave.exploredLocations, ...parsed.exploredLocations }
      };
    } catch {
      return { ...initialSave };
    }
  }

  save(next: LifeQuestSave): LifeQuestSave {
    const versioned = { ...next, version: 1 as const };
    localStorage.setItem(KEY, JSON.stringify(versioned));
    window.dispatchEvent(new CustomEvent('lifequest:save', { detail: versioned }));
    return versioned;
  }
}

export const saveRepository: SaveRepository = new LocalStorageSaveRepository();
export const loadSave = () => saveRepository.load();
export const saveGame = (next: LifeQuestSave) => saveRepository.save(next);

export function updateSave(updater: (current: LifeQuestSave) => LifeQuestSave) {
  return saveGame(updater(loadSave()));
}
