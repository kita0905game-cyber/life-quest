import { useEffect, useState } from 'react';
import LifeQuestGame from './game/LifeQuestGame';
import { loadSave, type LifeQuestSave } from './save/SaveRepository';
import { getLevel } from './game/systems/progression';

export default function App() {
  const [save, setSave] = useState<LifeQuestSave>(() => loadSave());

  useEffect(() => {
    const sync = (event: Event) => {
      const custom = event as CustomEvent<LifeQuestSave>;
      setSave(custom.detail ?? loadSave());
    };
    window.addEventListener('lifequest:save', sync);
    return () => window.removeEventListener('lifequest:save', sync);
  }, []);

  const progress = getLevel(save);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">PERSONAL FRONTIER RPG · V0.2</span>
          <h1>LIFE QUEST</h1>
        </div>
        <div className="player-level">YUMA <b>Lv.{progress.level}</b></div>
      </header>
      <section className="status-panel" aria-label="冒険者ステータス">
        <div className="status-row"><span>EXP {progress.currentXp}/{progress.targetXp}</span><span>累計 {save.xp} XP</span></div>
        <div className="xp-track"><i style={{ width: `${Math.min(100, progress.currentXp / progress.targetXp * 100)}%` }} /></div>
        <div className="resource-row"><span>🪙 {save.gold}G</span><span>⚡ {save.energy}</span><span>⛏ B{save.depth}F</span><span>⚙ {save.gears}</span><span>✦ {save.discoveries}</span></div>
      </section>
      <section className="game-frame">
        <LifeQuestGame />
      </section>
      <p className="footnote">V0.2 — 街・鉱山・釣り・工房・探索・図鑑・記録・BOSS / 自動セーブ</p>
    </main>
  );
}
