import Phaser from 'phaser';

export function addBackButton(scene: Phaser.Scene, target = 'TownScene') {
  const button = scene.add.text(24, 26, '← 街へ', {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '18px',
    color: '#fff2c2',
    backgroundColor: '#2b3d31',
    padding: { x: 10, y: 7 }
  }).setDepth(20).setInteractive({ useHandCursor: true });

  button.on('pointerup', () => scene.scene.start(target));
}

export function addTitle(scene: Phaser.Scene, title: string, subtitle?: string) {
  scene.add.text(195, 30, title, {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '26px',
    fontStyle: 'bold',
    color: '#fff4c8'
  }).setOrigin(0.5, 0);

  if (subtitle) {
    scene.add.text(195, 66, subtitle, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#c9d5cc'
    }).setOrigin(0.5, 0);
  }
}
