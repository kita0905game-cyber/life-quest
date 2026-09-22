export type Expedition = { site: '森' | '山' | '遺跡'; startedAt: number; returnsAt: number };
export type WarehouseMaterials = {
  stone: number; iron: number; copper: number; wood: number; crystal: number;
  ingots: number; copperIngots: number; gears: number; lanterns: number;
};
export type WagonTransfer = {
  id: string; from: string; to: string; materials: WarehouseMaterials; startedAt: string; arrivesAt: string;
};
export type GameAction = 'railway_build_first_freight' | 'hire_miner' | 'wagon_mountain_to_main' | 'unlock_automation';
export type LifeQuestSave = {
  version: 3;
  depth: number; energy: number; stone: number; iron: number; copper: number; wood: number; crystal: number;
  ingots: number; copperIngots: number; gears: number; lanterns: number;
  fishCaught: number; fishRecords: Record<string, number>; discoveredFish: string[]; fishInventory: Record<string, number>; bait: number;
  discoveries: number; loot: number; explorationTickets: number; expedition: Expedition | null;
  xp: number; lq: number; gold: number; knowledge: number; chests: number; bossHp: number; bossMax: number;
  mineLevel: number; workshopLevel: number; rocksBroken: number; casts: number; crafted: number; chestsOpened: number;
  exploredLocations: Record<string, number>; guildRewardClaimed: boolean; discoveredItems: string[]; eventCards: string[];
  hallOfFame: Record<string, number>; railwayTrainCount: number; railwayDepotUnlocked: boolean;
  automations: string[]; regionalWarehouses: Record<string, WarehouseMaterials>; wagonTransfers: WagonTransfer[];
  minerHiredUntil: string; minerLastSettledAt: string; updatedAt: number;
};

export type CloudStatus = 'pairing-required' | 'connecting' | 'connected' | 'offline' | 'error';
type PendingMutation = { id: string; before: LifeQuestSave; after: LifeQuestSave };

const KEY = 'life-quest-save-v1';
const TOKEN_KEY = 'life-quest-luna-token-v1';
const PENDING_KEY = 'life-quest-pending-mutations-v1';
const API = 'https://luna-core.kita0905-game.workers.dev';
const FISH = ['メダカ','フナ','コイ','ブラックバス','アジ','サバ','タイ','サケ','ウナギ','金魚','ニジマス','月影ゴイ'];

const emptyFishInventory = Object.fromEntries(FISH.map((name) => [name, 0])) as Record<string, number>;
const emptyWarehouse: WarehouseMaterials = {
  stone: 0, iron: 0, copper: 0, wood: 0, crystal: 0, ingots: 0, copperIngots: 0, gears: 0, lanterns: 0
};
const emptyRegionalWarehouses: Record<string, WarehouseMaterials> = {
  mountain: { ...emptyWarehouse }, forest: { ...emptyWarehouse }, waterside: { ...emptyWarehouse }, industrial: { ...emptyWarehouse }
};

function normalizeWarehouse(input?: Partial<WarehouseMaterials> | null): WarehouseMaterials {
  return {
    stone: Number(input?.stone ?? 0), iron: Number(input?.iron ?? 0), copper: Number(input?.copper ?? 0),
    wood: Number(input?.wood ?? 0), crystal: Number(input?.crystal ?? 0), ingots: Number(input?.ingots ?? 0),
    copperIngots: Number(input?.copperIngots ?? 0), gears: Number(input?.gears ?? 0), lanterns: Number(input?.lanterns ?? 0)
  };
}
const initialSave: LifeQuestSave = {
  version: 3, depth: 1, energy: 12, stone: 6, iron: 3, copper: 3, wood: 2, crystal: 0,
  ingots: 0, copperIngots: 0, gears: 0, lanterns: 0, fishCaught: 0, fishRecords: {}, discoveredFish: [], fishInventory: { ...emptyFishInventory }, bait: 3,
  discoveries: 0, loot: 0, explorationTickets: 1, expedition: null, xp: 0, lq: 0, gold: 120,
  knowledge: 0, chests: 1, bossHp: 600, bossMax: 600, mineLevel: 1, workshopLevel: 1,
  rocksBroken: 0, casts: 0, crafted: 0, chestsOpened: 0, exploredLocations: {}, guildRewardClaimed: false,
  discoveredItems: ['stone', 'iron', 'copper', 'wood'], eventCards: [], hallOfFame: {}, railwayTrainCount: 0, railwayDepotUnlocked: false,
  automations: [], regionalWarehouses: { ...emptyRegionalWarehouses }, wagonTransfers: [], minerHiredUntil: '', minerLastSettledAt: '', updatedAt: Date.now()
};

let cloudStatus: CloudStatus = 'connecting';
let syncInFlight: Promise<void> | null = null;

function emitCloudStatus(next: CloudStatus) {
  cloudStatus = next;
  window.dispatchEvent(new CustomEvent<CloudStatus>('lifequest:cloud', { detail: next }));
}

function normalizeSave(input: Partial<LifeQuestSave> | null | undefined): LifeQuestSave {
  const parsed = input ?? {};
  return {
    ...initialSave,
    ...parsed,
    version: 3,
    bossMax: Math.max(1, Number(parsed.bossMax ?? initialSave.bossMax)),
    bossHp: Number(parsed.version) === 1 && parsed.bossHp === 300 ? 600 : Number(parsed.bossHp ?? initialSave.bossHp),
    fishRecords: { ...(parsed.fishRecords ?? {}) },
    discoveredFish: [...new Set(parsed.discoveredFish ?? Object.keys(parsed.fishRecords ?? {}))],
    fishInventory: { ...emptyFishInventory, ...(parsed.fishInventory ?? {}) },
    exploredLocations: { ...(parsed.exploredLocations ?? {}) },
    discoveredItems: [...(parsed.discoveredItems ?? initialSave.discoveredItems)],
    eventCards: [...(parsed.eventCards ?? [])],
    hallOfFame: { ...(parsed.hallOfFame ?? {}) },
    railwayTrainCount: Number(parsed.railwayTrainCount ?? 0),
    railwayDepotUnlocked: parsed.railwayDepotUnlocked === true,
    automations: [...(parsed.automations ?? [])],
    regionalWarehouses: Object.fromEntries(
      Object.entries({ ...emptyRegionalWarehouses, ...(parsed.regionalWarehouses ?? {}) }).map(([region, stock]) => [region, normalizeWarehouse(stock)])
    ),
    wagonTransfers: (parsed.wagonTransfers ?? []).map((transfer) => ({
      ...transfer,
      materials: normalizeWarehouse(transfer.materials)
    })),
    minerHiredUntil: parsed.minerHiredUntil ?? '',
    minerLastSettledAt: parsed.minerLastSettledAt ?? '',
    lq: Number(parsed.lq ?? 0),
    updatedAt: Number(parsed.updatedAt ?? Date.now())
  };
}

function capturePairingToken() {
  try {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const token = params.get('lqToken')?.trim();
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  } catch {
    // Pairing can be retried by opening the pairing URL again.
  }
}

capturePairingToken();

function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) ?? ''; } catch { return ''; }
}

function persistLocal(next: LifeQuestSave) {
  const cards = new Set(next.eventCards);
  if (next.rocksBroken + next.crafted + next.fishCaught + next.discoveries > 0) cards.add('最初の一歩');
  if (next.rocksBroken > 0 || next.crafted > 0) cards.add('開拓者');
  if (next.fishCaught > 0) cards.add('最初の一匹');
  if (next.discoveries > 0) cards.add('世界の外へ');
  if (next.discoveredFish.length >= 5) cards.add('水辺の収集家');
  const versioned = normalizeSave({ ...next, eventCards: [...cards], version: 3, updatedAt: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(versioned));
  window.dispatchEvent(new CustomEvent<LifeQuestSave>('lifequest:save', { detail: versioned }));
  return versioned;
}

export function loadSave(): LifeQuestSave {
  try {
    const raw = localStorage.getItem(KEY);
    return normalizeSave(raw ? JSON.parse(raw) as Partial<LifeQuestSave> : initialSave);
  } catch {
    return normalizeSave(initialSave);
  }
}

function loadPending(): PendingMutation[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    const parsed = raw ? JSON.parse(raw) as PendingMutation[] : [];
    return Array.isArray(parsed) ? parsed.slice(0, 100) : [];
  } catch { return []; }
}

function savePending(items: PendingMutation[]) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(items.slice(-100))); } catch { /* local save still works */ }
}

async function fetchCloudSaveWithToken(token: string): Promise<LifeQuestSave> {
  const response = await fetch(`${API}/quest/client/bootstrap`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(response.status === 401 ? 'invalid-token' : `bootstrap-${response.status}`);
  const data = await response.json() as { save?: Partial<LifeQuestSave> };
  if (!data.save) throw new Error('bootstrap-empty');
  return normalizeSave(data.save);
}

async function fetchCloudSave(): Promise<LifeQuestSave> {
  const token = getToken();
  if (!token) throw new Error('pairing-required');
  return fetchCloudSaveWithToken(token);
}

export async function pairWithLunaCore(rawToken: string): Promise<LifeQuestSave> {
  const token = rawToken.trim();
  if (!token) throw new Error('token-required');
  emitCloudStatus('connecting');
  try {
    const remote = await fetchCloudSaveWithToken(token);
    localStorage.setItem(TOKEN_KEY, token);
    const next = persistLocal(remote);
    emitCloudStatus('connected');
    return next;
  } catch (error) {
    emitCloudStatus('pairing-required');
    throw error;
  }
}

export function getSafariPairingBridgeUrl() {
  const token = getToken();
  if (!token) throw new Error('pairing-required');
  return `${API}/quest/browser-pair#lqToken=${encodeURIComponent(token)}`;
}

async function pushMutation(item: PendingMutation) {
  const token = getToken();
  if (!token) throw new Error('pairing-required');
  const response = await fetch(`${API}/quest/client/mutation`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutationId: item.id, before: item.before, after: item.after })
  });
  if (!response.ok) throw new Error(`mutation-${response.status}`);
}

async function flushPendingInternal() {
  const token = getToken();
  if (!token) { emitCloudStatus('pairing-required'); return; }
  emitCloudStatus('connecting');
  let pending = loadPending();
  while (pending.length > 0) {
    await pushMutation(pending[0]);
    pending = pending.slice(1);
    savePending(pending);
  }
  const authoritative = await fetchCloudSave();
  persistLocal(authoritative);
  emitCloudStatus('connected');
}

export function flushPendingMutations() {
  if (!syncInFlight) {
    syncInFlight = flushPendingInternal()
      .catch((error: unknown) => {
        emitCloudStatus(error instanceof Error && error.message === 'pairing-required' ? 'pairing-required' : 'offline');
      })
      .finally(() => { syncInFlight = null; });
  }
  return syncInFlight;
}

export async function bootstrapCloudSave(): Promise<LifeQuestSave> {
  const token = getToken();
  if (!token) {
    emitCloudStatus('pairing-required');
    return loadSave();
  }
  emitCloudStatus('connecting');
  try {
    const remote = await fetchCloudSave();
    persistLocal(remote);
    await flushPendingMutations();
    const finalState = loadSave();
    emitCloudStatus('connected');
    return finalState;
  } catch {
    emitCloudStatus('offline');
    return loadSave();
  }
}

export async function refreshCloudSave(): Promise<LifeQuestSave> {
  await flushPendingMutations();
  const token = getToken();
  if (!token) return loadSave();
  try {
    const remote = await fetchCloudSave();
    persistLocal(remote);
    emitCloudStatus('connected');
    return remote;
  } catch {
    emitCloudStatus('offline');
    return loadSave();
  }
}

function mutationId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function saveGame(next: LifeQuestSave): LifeQuestSave {
  const before = loadSave();
  const after = persistLocal(next);
  const pending = loadPending();
  pending.push({ id: mutationId(), before, after });
  savePending(pending);
  void flushPendingMutations();
  return after;
}

export function updateSave(updater: (current: LifeQuestSave) => LifeQuestSave) {
  const before = loadSave();
  const after = persistLocal(updater(before));
  const pending = loadPending();
  pending.push({ id: mutationId(), before, after });
  savePending(pending);
  void flushPendingMutations();
  return after;
}

export async function performGameAction(action: GameAction, params: { automation?: string } = {}) {
  const token = getToken();
  if (!token) throw new Error('LUNA CORE未接続');
  emitCloudStatus('connecting');
  try {
    const response = await fetch(`${API}/quest/action`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionId: mutationId(), action, ...params })
    });
    const data = await response.json() as {
      error?: string;
      receipt?: { save?: Partial<LifeQuestSave>; message?: string; reward?: Record<string, string | number> };
    };
    if (!response.ok || !data.receipt?.save) throw new Error(data.error ?? `action-${response.status}`);
    const next = persistLocal(normalizeSave(data.receipt.save));
    emitCloudStatus('connected');
    return { save: next, message: data.receipt.message ?? '', reward: data.receipt.reward ?? {} };
  } catch (error) {
    emitCloudStatus('offline');
    throw error;
  }
}

export const getCloudStatus = () => cloudStatus;
