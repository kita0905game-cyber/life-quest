import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { TownScene } from './scenes/TownScene';
import { MineScene } from './scenes/MineScene';
import { FishingScene } from './scenes/FishingScene';
import { WorkshopScene } from './scenes/WorkshopScene';
import { ExploreScene } from './scenes/ExploreScene';

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
      scene: [TownScene, MineScene, FishingScene, WorkshopScene, ExploreScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      input: { activePointers: 3 }
    });

    return () => game.destroy(true);
  }, []);

  return <div className="game-host" ref={hostRef} />;
}
