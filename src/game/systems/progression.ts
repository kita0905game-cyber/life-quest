import type { LifeQuestSave } from '../../save/SaveRepository';
import { xpForLevel } from '../data/gameData';

export function getLevel(save: LifeQuestSave) {
  const level = Math.min(50, Math.floor(save.xp / 100) + 1);
  return { level, master: save.xp >= 5000 ? Math.floor(save.xp / 5000) : 0, currentXp: save.xp % 100, targetXp: xpForLevel() };
}

export function reward(save: LifeQuestSave, xp: number, gold: number): LifeQuestSave {
  return { ...save, xp: save.xp + xp, gold: save.gold + gold };
}
