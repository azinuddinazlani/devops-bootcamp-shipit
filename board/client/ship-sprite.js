// board/client/ship-sprite.js
// One-time GLB → 2D sprite renders for the race track. Each (shipModel, color)
// pair is rendered once to a small transparent canvas and cached as a data-URL;
// after that the race is plain DOM — no per-frame WebGL. Resolves null when
// WebGL or the models are unavailable; the track shows a tinted glyph instead.
import * as THREE from 'three';
import { createShip, preloadShipTemplates, disposeShip } from './ship-mesh.js';

const SIZE = 64;
const cache = new Map(); // `${shipModel}|${color}` -> Promise<string|null>
let ctx; // lazy { renderer, scene, camera }; null = WebGL unavailable

function setup() {
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(SIZE, SIZE);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1.6, 1.6, 1.6, -1.6, 0.1, 50);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(2, 4, 6);
    scene.add(key);
    return { renderer, scene, camera };
  } catch {
    return null;
  }
}

async function render(shipModel, color) {
  const templates = await preloadShipTemplates();
  if (ctx === undefined) ctx = setup();
  if (!ctx) return null;
  const template = templates.get(shipModel) || templates.get('fighter');
  const ship = createShip({ callsign: '', color, shipModel, template });
  ship.rotation.y = Math.PI / 2; // side profile, nose toward +x — matches track direction
  ctx.scene.add(ship);
  ctx.renderer.render(ctx.scene, ctx.camera);
  const url = ctx.renderer.domElement.toDataURL('image/png');
  ctx.scene.remove(ship);
  disposeShip(ship);
  return url;
}

export function shipSprite(shipModel, color) {
  const k = `${shipModel}|${color}`;
  if (!cache.has(k)) cache.set(k, render(shipModel, color).catch(() => null));
  return cache.get(k);
}
