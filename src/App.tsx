import { useEffect, useState } from 'react';
import LifeQuestGame from './game/LifeQuestGame';
import { bootstrapCloudSave, getCloudStatus, loadSave, refreshCloudSave, type CloudStatus, type LifeQuestSave } from './save/SaveRepository';
import { getLevel } from './game/systems/progression';

const cloudLabel: Record<CloudStatus, string> = {
  'pairing-required': 'LUNA CORE 未接続',
  connecting: 'LUNA CORE 接続中',
  connected: 'LUNA CORE 同期済み',
  offline: 'オフライン保存中',
  error: '同期エラー'
};

export default function App() {
  const [save, setSave] = useState<LifeQuestSave>(() => loadSave());
  const [ready, setReady] = useState(false);
  const [cloud, setCloud] = useState<CloudStatus>(() => getCloudStatus());

  useEffect(() => {
    let active = true;
    const syncSave = (event: Event) => {
      const custom = event as CustomEvent<LifeQuestSave>;
      if (active) setSave(custom.detail ?? loadSave());
    };
    const syncCloud = (event: Event) => {
      const custom = event as CustomEvent<CloudStatus>;
      if (active) setCloud(custom.detail ?? getCloudStatus());
    };
    const refresh = () => {
      void refreshCloudSave().then((next) => {
        if (active) setSave(next);
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('lifequest:save', syncSave);
    window.addEventListener('lifequest:cloud', syncCloud);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisibility);

    void bootstrapCloudSave().then((next) => {
      if (!active) return;
      setSave(next);
      setCloud(getCloudStatus());
      setReady(true);
    });

    return () => {
      active = false;
      window.removeEventListener('lifequest:save', syncSave);
      window.removeEventListener('lifequest:cloud', syncCloud);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (!ready) {
    return (
      <main className="app-shell">
        <header className="app-header">
          <div>
            <span className="eyebrow">PERSONAL FRONTIER RPG · V0.5</span>
            <h1>LIFE QUEST</h1>
          </div>
        </header>
        <section className="status-panel" aria-label="LIFE QUEST起動状態">
          <div className="status-row"><span>LUNA COREから冒険記録を読み込み中…</span></div>
        </section>
      </main>
    );
  }

  if (cloud === 'pairing-required') {
    return (
      <main className="app-shell">
        <header className="app-header">
          <div>
            <span className="eyebrow">PERSONAL FRONTIER RPG · V0.5</span>
            <h1>LIFE QUEST</h1>
          </div>
        </header>
        <section className="status-panel" aria-label="LUNA CORE接続状態">
          <div className="status-row"><span>LUNA CORE 未接続</span></div>
          <p style={{ margin: 0, paddingTop: 12 }}>
            このブラウザはまだLUNA COREとペアリングされていません。初期セーブではなく、正本へ接続してから冒険を開始します。
          </p>
        </section>
      </main>
    );
  }

  const progress = getLevel(save);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">PERSONAL FRONTIER RPG · V0.5</span>
          <h1>LIFE QUEST</h1>
        </div>
        <div className="player-level">YUMA <b>Lv.{progress.level}</b></div>
      </header>
      <section className="status-panel" aria-label="冒険者ステータス">
        <div className="status-row"><span>EXP {progress.currentXp}/{progress.targetXp}</span><span>累計 {save.xp} XP</span></div>
        <div className="xp-track"><i style={{ width: `${Math.min(100, progress.currentXp / progress.targetXp * 100)}%` }} /></div>
        <div className="resource-row">
          <span>✦ {save.lq} LQ</span><span>🪙 {save.gold}G</span><span>⚡ {save.energy}</span><span>🪱 {save.bait}</span><span>🎫 {save.explorationTickets}</span><span>🎁 {save.chests}</span>
        </div>
      </section>
      <section className="game-frame">
        <LifeQuestGame />
      </section>
      <p className="footnote">V0.5 — {cloudLabel[cloud]} / LUNA CORE正本・自動同期</p>
    </main>
  );
}
