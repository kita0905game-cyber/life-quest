import { useEffect, useState } from 'react';
import LifeQuestGame from './game/LifeQuestGame';
import { loadSave, type LifeQuestSave } from './save/SaveRepository';

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

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">MOBILE PROTOTYPE</span>
          <h1>LIFE QUEST</h1>
        </div>
        <div className="resource-chip">B{save.depth}F · 鉱石 {save.iron} · 魚 {save.fishCaught}</div>
      </header>
      <section className="game-frame">
        <LifeQuestGame />
      </section>
      <p className="footnote">V0.1 — 街・鉱山・釣り・工房・探索 / ローカルセーブ</p>
    </main>
  );
}
