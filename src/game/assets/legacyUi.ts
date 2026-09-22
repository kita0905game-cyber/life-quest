import Phaser from 'phaser';

export const TOWN_ART_URL = 'https://raw.githubusercontent.com/kita0905game-cyber/life-quest-assets/main/life-quest-ideal.png';

export function addCoverImage(scene: Phaser.Scene, textureKey: string, width = 390, height = 680) {
  const texture = scene.textures.get(textureKey);
  const source = texture.getSourceImage() as { width: number; height: number };
  const image = scene.add.image(width / 2, height / 2, textureKey);
  if (source?.width && source?.height) {
    const scale = Math.max(width / source.width, height / source.height);
    image.setScale(scale);
  } else {
    image.setDisplaySize(width, height);
  }
  return image;
}

export function ensureGridFrames(scene: Phaser.Scene, textureKey: string, columns: number, rows: number, prefix: string) {
  const texture = scene.textures.get(textureKey);
  const source = texture.getSourceImage() as { width: number; height: number };
  if (!source?.width || !source?.height) return;
  const frameWidth = source.width / columns;
  const frameHeight = source.height / rows;

  for (let index = 0; index < columns * rows; index += 1) {
    const frameName = `${prefix}-${index}`;
    if (texture.has(frameName)) continue;
    texture.add(
      frameName,
      0,
      (index % columns) * frameWidth,
      Math.floor(index / columns) * frameHeight,
      frameWidth,
      frameHeight
    );
  }
}

export function addSceneHeading(
  scene: Phaser.Scene,
  eyebrow: string,
  title: string,
  right: string,
  rightCaption: string
) {
  scene.add.text(20, 18, eyebrow, {
    fontFamily: 'Georgia, "Noto Serif JP", serif',
    fontSize: '9px',
    color: '#ead29d'
  }).setDepth(20);

  scene.add.text(20, 36, title, {
    fontFamily: 'Georgia, "Noto Serif JP", serif',
    fontSize: '25px',
    color: '#fff2d2',
    fontStyle: 'bold'
  }).setDepth(20);

  scene.add.text(368, 20, right, {
    fontFamily: 'Georgia, serif',
    fontSize: '26px',
    color: '#fff2d2',
    align: 'right'
  }).setOrigin(1, 0).setDepth(20);

  scene.add.text(368, 53, rightCaption, {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '9px',
    color: '#d6c6a8',
    align: 'right'
  }).setOrigin(1, 0).setDepth(20);
}

export function addSceneVignette(scene: Phaser.Scene) {
  scene.add.rectangle(195, 34, 390, 100, 0x071611, 0.48).setDepth(10);
  scene.add.rectangle(195, 642, 390, 76, 0x071712, 0.72).setDepth(10);
}

export function addSceneFooter(scene: Phaser.Scene, left: string, leftCaption: string, right: string) {
  scene.add.text(18, 620, left, {
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    color: '#f8eacc'
  }).setDepth(20);

  scene.add.text(18, 644, leftCaption, {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '8px',
    color: '#d6c6a8'
  }).setDepth(20);

  scene.add.text(372, 626, right, {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '10px',
    color: '#eef0df',
    align: 'right',
    wordWrap: { width: 210 }
  }).setOrigin(1, 0).setDepth(20);
}

export function addPlaque(scene: Phaser.Scene, x: number, y: number, label: string) {
  const plaque = scene.add.text(x, y, label, {
    fontFamily: 'Georgia, "Noto Serif JP", serif',
    fontSize: '9px',
    color: '#f3e5be',
    backgroundColor: '#1b3028e8',
    padding: { x: 8, y: 5 },
    stroke: '#5f4c2c',
    strokeThickness: 1
  }).setOrigin(0.5).setDepth(20);
  return plaque;
}
