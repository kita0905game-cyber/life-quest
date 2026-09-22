import { useEffect, useState, type FormEvent } from 'react';
import LifeQuestGame from './game/LifeQuestGame';
import {
  bootstrapCloudSave,
  createHomeScreenPairingTicket,
  getSafariPairingBridgeUrl,
  getCloudStatus,
  loadSave,
  pairWithLunaCore,
  redeemHomeScreenPairingCode,
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
  if (message === 'pairing-code-required') return 'ホーム画面接続コードを入力してください。';
  if (message === 'pairing_code_expired' || message === 'pairing_code_not_found' || message === 'invalid_pairing_code') return 'ホーム画面接続コードが無効か期限切れです。Safari側で新しいコードを発行してください。';
  return 'LUNA COREへ接続できませんでした。通信状態を確認して、もう一度試してください。';
}

function worldPhase(date: Date) {
  const season = ['冬', '冬', '春', '春', '春', '夏', '夏', '夏', '秋', '秋', '秋', '冬'][date.getMonth()];
  const hour = date.getHours();
  const time = hour >= 5 && hour < 10 ? '朝' : hour < 17 ? '昼' : hour < 20 ? '夕方' : '夜';
  return `${season}・${time}`;
}

export default function App() {
  const [save, setSave] = useState<LifeQuestSave>(() => loadSave());
  const [ready, setReady] = useState(false);
  const [cloud, setCloud] = useState<CloudStatus>(() => getCloudStatus());
  const [pairingToken, setPairingToken] = useState('');
  const [pairingBusy, setPairingBusy] = useState(false);
  const [pairingError, setPairingError] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [homePairMessage, setHomePairMessage] = useState('');
  const [homePairCode, setHomePairCode] = useState('');
  const [activeScene, setActiveScene] = useState('TownScene');
  const [clock, setClock] = useState(() => new Date());

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
    const syncScene = (event: Event) => {
      const custom = event as CustomEvent<string>;
      if (active && custom.detail) setActiveScene(custom.detail);
    };

    window.addEventListener('lifequest:save', syncSave);
    window.addEventListener('lifequest:cloud', syncCloud);
    window.addEventListener('lifequest:scene', syncScene);
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
      window.removeEventListener('lifequest:scene', syncScene);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 60_000);
    return () => window.clearInterval(timer);
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

  async function connectWithPairingCode(rawCode: string) {
    if (pairingBusy) return;
    setPairingBusy(true);
    setPairingError('');
    try {
      const next = await redeemHomeScreenPairingCode(rawCode);
      setSave(next);
      setPairingCode('');
      setCloud('connected');
    } catch (error) {
      setPairingError(pairingErrorMessage(error));
    } finally {
      setPairingBusy(false);
    }
  }

  async function handlePairingCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await connectWithPairingCode(pairingCode);
  }

  async function handleClipboardPair() {
    try {
      const value = await navigator.clipboard.readText();
      await connectWithPairingCode(value);
    } catch {
      setPairingError('クリップボードを読めませんでした。下の接続コード欄へ貼り付けてください。');
    }
  }

  async function handlePrepareHomeScreen() {
    setHomePairMessage('');
    setHomePairCode('');
    try {
      const ticket = await createHomeScreenPairingTicket();
      setHomePairCode(ticket.code);
      try {
        await navigator.clipboard.writeText(ticket.clipboardText);
        setHomePairMessage('ホーム画面接続コードをコピーしました。10分以内にホーム画面版LIFE QUESTを開いて「Safariから接続」を押してください。');
      } catch {
        setHomePairMessage('コピーできませんでした。表示中の接続コードをホーム画面版LIFE QUESTへ入力してください。');
      }
    } catch {
      setHomePairMessage('ホーム画面接続コードを発行できませんでした。少し待ってからもう一度試してください。');
    }
  }

  function handleOpenPairingPage() {
    try {
      window.location.assign(getSafariPairingBridgeUrl());
    } catch {
      setPairingError('接続ページを開けませんでした。LUNA COREの接続状態を確認してください。');
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
            <b>ホーム画面版を接続する</b>
            <span>Safariで接続済みのLIFE QUESTを開き、「ホーム画面接続を準備」でコードをコピーしてから戻ってきてください。</span>
            <button className="pairing-action-button" type="button" onClick={handleClipboardPair} disabled={pairingBusy}>
              {pairingBusy ? '接続中…' : 'Safariから接続'}
            </button>
          </div>

          <form className="pairing-form" onSubmit={handlePairingCode}>
            <label htmlFor="lq-pair-code">ホーム画面接続コード</label>
            <input
              id="lq-pair-code"
              type="text"
              value={pairingCode}
              onChange={(event) => setPairingCode(event.target.value)}
              placeholder="例: ABCD234XYZ"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              disabled={pairingBusy}
            />
            <button type="submit" disabled={pairingBusy || !pairingCode.trim()}>
              {pairingBusy ? '接続中…' : '接続コードで接続'}
            </button>
          </form>

          <div className="pairing-divider"><span>または</span></div>

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
  const nextLevelXp = Math.max(0, progress.targetXp - progress.currentXp);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">PERSONAL FRONTIER RPG · V0.5</span>
          <h1>LIFE QUEST</h1>
        </div>
        <div className="player-meta">
          <div className="player-level">YUMA <b>Lv.{progress.level}</b></div>
          <span className="world-phase">{worldPhase(clock)}</span>
        </div>
      </header>

      <section className="status-panel" aria-label="冒険者ステータス">
        <div className="status-row">
          <span>EXP {progress.currentXp}/{progress.targetXp}</span>
          <span>累計 {save.xp} XP · あと {nextLevelXp}</span>
        </div>
        <div className="xp-track"><i style={{ width: `${Math.min(100, progress.currentXp / progress.targetXp * 100)}%` }} /></div>
        <div className="resource-row">
          <span>✦ {save.lq}<small>LQ</small></span>
          <span>◉ {save.gold}<small>G</small></span>
          <span>⚡ {save.energy}</span>
          <span>🪱 {save.bait}</span>
          <span>🎫 {save.explorationTickets}</span>
          <span>🎁 {save.chests}</span>
        </div>
      </section>

      <div className={`game-stage ${activeScene === 'TownScene' ? 'town-stage' : ''}`}>
        <section className="game-frame">
          <LifeQuestGame />
        </section>
      </div>

      <div className="app-footer">
        <div className="sync-line">
          <span className={`sync-dot ${cloud === 'connected' ? 'ok' : ''}`} />
          <span>{cloudLabel[cloud]} / LUNA CORE正本</span>
        </div>
        {cloud === 'connected' && (
          <details className="connection-tools">
            <summary>接続設定</summary>
            <div className="connection-actions">
              <button className="pairing-link-button" type="button" onClick={handlePrepareHomeScreen}>
                ホーム画面接続を準備
              </button>
              {homePairMessage && <p className="home-pair-message">{homePairMessage}</p>}
              {homePairCode && <p className="home-pair-code">接続コード {homePairCode}</p>}
              <button className="pairing-link-button secondary-link" type="button" onClick={handleOpenPairingPage}>
                Safari接続ページを開く
              </button>
            </div>
          </details>
        )}
      </div>
    </main>
  );
}
