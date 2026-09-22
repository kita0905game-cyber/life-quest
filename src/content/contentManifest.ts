import { fishMaster } from './fishMaster';
import { agricultureMaster, materialMaster, recipeMaster, tradeGoodMaster } from './economyMaster';
import { achievementMaster, npcMaster, questTemplateMaster } from './societyMaster';
import { equipmentMaster, museumMaster, researchMaster, treasureMaster } from './progressionMaster';
import { routeMaster, transportVehicleMaster } from './transportMaster';
import { buildingMaster, regionMaster, seasonEventMaster, weatherMaster } from './worldMaster';

export const contentManifest = {
    fish: fishMaster.length,
    regions: regionMaster.length,
    buildings: buildingMaster.length,
    weather: weatherMaster.length,
    seasonEvents: seasonEventMaster.length,
    materials: materialMaster.length,
    agriculture: agricultureMaster.length,
    recipes: recipeMaster.length,
    tradeGoods: tradeGoodMaster.length,
    transportVehicles: transportVehicleMaster.length,
    routes: routeMaster.length,
    npcs: npcMaster.length,
    questTemplates: questTemplateMaster.length,
    achievements: achievementMaster.length,
    equipment: equipmentMaster.length,
    research: researchMaster.length,
    museumExhibits: museumMaster.length,
    treasures: treasureMaster.length,
} as const;

export const contentManifestTotal = Object.values(contentManifest).reduce((sum, count) => sum + count, 0);

/**
 * Internal future-content inventory only.
 * Importing this manifest must never be used as an automatic instruction to expose PREPARED
 * content in the live game. Each domain requires an explicit migration/release decision.
 */
export const contentManifestPolicy = 'PREPARED content is dormant until explicitly promoted to LIVE.' as const;
