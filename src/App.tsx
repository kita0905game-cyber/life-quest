import { useEffect, useState, type FormEvent } from 'react';
import LifeQuestGame from './game/LifeQuestGame';
import {
  bootstrapCloudSave,
  getBrowserPairingLink,
  getCloudStatus,
  loadSave,
  pairWithLunaCore,
  refreshCloudSave,
  type CloudStatus,
  type LifeQuestSave
} from './save/SaveRepository';
import { getLevel } from './game/systems/progression';

const cloudLabel: Record<CloudStatus, string> = {
  'pairing-required': 'LUNA CORE 未接続',
  connecting: 'LUNA CORE 接続中',
  connected: 'LUNA CORE 同期済み',
  offline: 'オフライン保存中',
  error: '同期エラー'
};

function pairingErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message === 'invalid-token') return '接続トークンが違います。接続済みLIFE QUESTから新しい接続リンクを作ってください。';
  if (message === 'token-required') return '接続トークンを入力してください。';
  return 'LUNA COREへ接続できませんでした。通信状態を確認して、もう一度試してください。';
}

export default function App() {
  const [save, setSave] = useState<LifeQuestSave>(() => loadSave());
  const [ready, setReady] = useState(false);
  const [cloud, setCloud] = useState<CloudStatus>(() => getCloudStatus());
  const [pairingToken, setPairingToken] = useState('');
  const [pairingBusy, setPairingBusy] = useState(false);
  const [pairingError, setPairingError] = useState('');
  const [pairingCopied, setPairingCopied] = useState(false);

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

  async function handlePair(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pairingBusy) return;
    setPairingBusy(true);
    setPairingError('');
    try {
      const next = await pairWithLunaCore(pairingToken);
      setSave(next);
      setPairingToken('');
      setCloud('connected');
    } catch (error) {
      setPairingError(pairingErrorMessage(error));
    } finally {
      setPairingBusy(false);
    }
  }

  async function handleCopyPairingLink() {
    setPairingCopied(false);
    try {
      const link = getBrowserPairingLink();
      await navigator.clipboard.writeText(link);
      setPairingCopied(true);
      window.setTimeout(() => setPairingCopied(false), 3000);
    } catch {
      setPairingCopied(false);
    }
  }

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
      <main className="app-shell pairing-shell">
        <header className="app-header">
          <div>
            <span className="eyebrow">PERSONAL FRONTIER RPG · V0.5</span>
            <h1>LIFE QUEST</h1>
          </div>
        </header>

        <section className="pairing-panel" aria-label="LUNA CORE接続">
          <div className="pairing-badge">LUNA CORE</div>
          <h2>冒険記録へ接続</h2>
          <p className="pairing-lead">
            このブラウザをLUNA COREの正本へ接続します。接続できるまで初期セーブでは開始しません。
          </p>

          <div className="pairing-guide">
            <b>いちばん簡単</b>
            <span>接続済みのLIFE QUESTで「Safari接続リンクをコピー」→ Safariのアドレス欄へ貼り付け。</span>
          </div>

          <form className="pairing-form" onSubmit={handlePair}>
            <label htmlFor="lq-token">接続トークンを直接入力する場合</label>
            <input
              id="lq-token"
              type="password"
              value={pairingToken}
              onChange={(event) => setPairingToken(event.target.value)}
              placeholder="LUNA CORE 接続トークン"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              disabled={pairingBusy}
            />
            <button type="submit" disabled={pairingBusy || !pairingToken.trim()}>
              {pairingBusy ? '接続中…' : 'LUNA COREに接続'}
            </button>
          </form>

          {pairingError && <p className="pairing-error">{pairingError}</p>}
          <p className="pairing-note">接続情報はこのブラウザ内に保存されます。GitHubや画面上へ接続トークンを保存しません。</p>
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
      <div className="app-footer">
        <p className="footnote">V0.5 — {cloudLabel[cloud]} / LUNA CORE正本・自動同期</p>
        {cloud === 'connected' && (
          <button className="pairing-link-button" type="button" onClick={handleCopyPairingLink}>
            {pairingCopied ? 'Safari接続リンクをコピー済み' : 'Safari接続リンクをコピー'}
          </button>
        )}
      </div>
    </main>
  );
}
