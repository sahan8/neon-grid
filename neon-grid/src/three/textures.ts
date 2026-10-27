import * as THREE from 'three';

/** Procedural lit-windows texture for skyscrapers (no image download). */
export function makeWindowTexture(seed = 1): THREE.CanvasTexture {
  const w = 64, h = 128;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = '#05060a';
  g.fillRect(0, 0, w, h);
  let s = seed * 9301;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const palette = ['#00F0FF', '#FF2A6D', '#F5E642', '#E8F1FF', '#7B2CFF'];
  for (let y = 2; y < h; y += 4) {
    for (let x = 2; x < w; x += 4) {
      if (rnd() > 0.62) {
        g.fillStyle = palette[Math.floor(rnd() * palette.length)];
        g.globalAlpha = 0.35 + rnd() * 0.65;
        g.fillRect(x, y, 2, 2);
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Holographic billboard: neon glyphs + scanlines on a gradient. */
export function makeBillboardTexture(text: string, color: string, vertical = false): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = vertical ? 128 : 512;
  c.height = vertical ? 512 : 256;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, c.width, c.height);
  grad.addColorStop(0, color + '55');
  grad.addColorStop(1, '#05060a');
  g.fillStyle = grad;
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = color;
  g.lineWidth = 6;
  g.strokeRect(6, 6, c.width - 12, c.height - 12);
  g.fillStyle = color;
  g.shadowColor = color;
  g.shadowBlur = 24;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  if (vertical) {
    g.font = 'bold 72px sans-serif';
    [...text].forEach((ch, i) => g.fillText(ch, c.width / 2, 80 + i * 90));
  } else {
    g.font = 'bold 88px sans-serif';
    g.fillText(text, c.width / 2, c.height / 2);
  }
  g.shadowBlur = 0;
  g.globalAlpha = 0.18;
  g.fillStyle = '#000';
  for (let y = 0; y < c.height; y += 4) g.fillRect(0, y, c.width, 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
