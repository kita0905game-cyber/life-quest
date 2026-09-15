import type { LifeQuestSave } from '../../save/SaveRepository';
import { xpForLevel } from '../data/gameData';

export function getLevel(save: LifeQuestSave) {
  let level = 1;
  let remaining = save.xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level += 1;
  }
  return { level, currentXp: remaining, targetXp: xpForLevel(level) };
}

export function reward(save: LifeQuestSave, xp: number, gold: number): LifeQuestSave {
  return { ...save, xp: save.xp + xp, gold: save.gold + gold };
}
