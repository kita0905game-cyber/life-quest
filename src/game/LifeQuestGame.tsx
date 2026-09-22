import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { TownScene } from './scenes/TownScene';
import { MineScene } from './scenes/MineScene';
import { FishingScene } from './scenes/FishingScene';
import { WorkshopScene } from './scenes/WorkshopScene';
import { ExploreScene } from './scenes/ExploreScene';
import { MuseumScene } from './scenes/MuseumScene';
import { BossScene } from './scenes/BossScene';
import { RecordsScene } from './scenes/RecordsScene';
import { GuildScene } from './scenes/GuildScene';
import { HouseScene } from './scenes/HouseScene';
import { RailwayScene } from './scenes/RailwayScene';

const SCENE_KEYS = [
  'TownScene',
  'MineScene',
  'FishingScene',
  'WorkshopScene',
  'ExploreScene',
  'MuseumScene',
  'BossScene',
  'RecordsScene',
  'GuildScene',
  'HouseScene',
  'RailwayScene'
] as const;

export default function LifeQuestGame() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      width: 390,
      height: 680,
      backgroundColor: '#10241f',
      scene: [TownScene, MineScene, FishingScene, WorkshopScene, ExploreScene, MuseumScene, BossScene, RecordsScene, GuildScene, HouseScene, RailwayScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      input: { activePointers: 3 }
    });

    const onNavigate = (event: Event) => {
      const custom = event as CustomEvent<string>;
      const sceneKey = custom.detail;
      if (!SCENE_KEYS.includes(sceneKey as (typeof SCENE_KEYS)[number])) return;
      if (game.scene.isActive(sceneKey)) return;
      game.scene.start(sceneKey);
    };

    const subscriptions: Array<{ scene: Phaser.Scene; handler: () => void }> = [];
    const attachSceneSignals = () => {
      SCENE_KEYS.forEach((sceneKey) => {
        const scene = game.scene.getScene(sceneKey);
        const handler = () => {
          window.dispatchEvent(new CustomEvent<string>('lifequest:scene', { detail: sceneKey }));
        };
        scene.events.on(Phaser.Scenes.Events.START, handler);
        subscriptions.push({ scene, handler });
      });

      const activeScene = game.scene.getScenes(true)[0];
      if (activeScene) {
        window.dispatchEvent(new CustomEvent<string>('lifequest:scene', { detail: activeScene.scene.key }));
      }
    };

    window.addEventListener('lifequest:navigate', onNavigate);
    game.events.once(Phaser.Core.Events.READY, attachSceneSignals);

    return () => {
      window.removeEventListener('lifequest:navigate', onNavigate);
      subscriptions.forEach(({ scene, handler }) => {
        scene.events.off(Phaser.Scenes.Events.START, handler);
      });
      game.destroy(true);
    };
  }, []);

  return <div className="game-host" ref={hostRef} />;
}
