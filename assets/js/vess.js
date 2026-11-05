/* Vess, the mascot: a living flask whose glowing liquid holds the trainer. Flags: 1 liquid surface, 2 eye, 3 orbiting spark. */
function vessVoxels() {
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = list => list[Math.floor(rand() * list.length)];
  const out = [];
  const R = 14, CY = -7, LEVEL = 1;
  const eye = (x, y) => (Math.abs(Math.abs(x) - 5.5) <= 2 && y >= -9 && y <= -3);
  const shine = (x, y) => (x === -6 || x === 5) && y === -4;
  const smile = (x, y) => Math.abs(x) <= 3 && y === Math.round(-13 + x * x / 5);
  const cheek = (x, y) => Math.abs(Math.abs(x) - 9) <= 1 && y >= -11 && y <= -10;

  for (let x = -R - 1; x <= R + 1; x++) for (let y = -R - 1; y <= R + 1; y++) for (let z = -R - 1; z <= R + 1; z++) {
    const d = Math.hypot(x, y, z);
    if (Math.abs(d - R) > .75) continue;
    const wy = y + CY;
    if (wy > LEVEL) {
      if (rand() < .34) out.push([x, wy, z, pick([0xbfe6ff, 0xd9f1ff, 0x9fd4f5])]);
      continue;
    }
    const front = z > 6;
    if (front && eye(x, wy)) { out.push([x, wy, z, shine(x, wy) ? 0xffffff : 0x140a2a, shine(x, wy) ? 0 : 2]); continue; }
    if (front && smile(x, wy)) { out.push([x, wy, z, 0x140a2a]); continue; }
    if (front && cheek(x, wy)) { out.push([x, wy, z, 0xff7ab8]); continue; }
    const k = (wy + 21) / 22;
    out.push([x, wy, z, k > .72 ? pick([0xc98bff, 0xb06cff]) : k > .36 ? pick([0x9a5cff, 0x8a4dff]) : pick([0x6f3cf0, 0x5f33d8])]);
  }

  /* The surface of the liquid, seen through the glass. */
  for (let x = -R; x <= R; x++) for (let z = -R; z <= R; z++)
    if (Math.hypot(x, z) < 13.4) out.push([x, LEVEL, z, pick([0xffd27a, 0xffc35c, 0xe9a9ff]), 1]);

  /* Neck, rim and cork. */
  for (let y = 7; y <= 15; y++) for (let a = 0; a < 32; a++) {
    const t = a / 32 * 6.2832;
    out.push([Math.round(Math.cos(t) * 5), y, Math.round(Math.sin(t) * 5), pick([0xbfe6ff, 0xd9f1ff])]);
  }
  for (let a = 0; a < 40; a++) {
    const t = a / 40 * 6.283;
    for (const y of [16, 17]) out.push([Math.round(Math.cos(t) * 6.5), y, Math.round(Math.sin(t) * 6.5), 0xeaf7ff]);
  }
  for (let y = 15; y <= 21; y++) for (let x = -4; x <= 4; x++) for (let z = -4; z <= 4; z++)
    if (Math.hypot(x, z) < 4.3) out.push([x, y, z, pick([0xc08a55, 0xb37c48, 0xd09a62])]);

  for (let i = 0; i < 110; i++) {
    const a = rand() * 6.283, r = 21 + rand() * 9;
    out.push([Math.cos(a) * r, (rand() - .5) * 42, Math.sin(a) * r, pick([0xffd27a, 0xffe9b0, 0xc98bff]), 3]);
  }
  return out;
}

/* A small standalone Vess for the secondary pages. */
function mountVess(canvas) {
  if (!window.THREE) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 300);
  camera.position.set(0, 4, 118);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4a3a90, 2.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(30, 50, 60);
  scene.add(sun);

  const list = vessVoxels();
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial(), list.length);
  const color = new THREE.Color(), matrix = new THREE.Matrix4();
  list.forEach((v, i) => {
    matrix.makeTranslation(v[0], v[1], v[2]);
    mesh.setMatrixAt(i, matrix);
    mesh.setColorAt(i, color.setHex(v[3]));
  });
  scene.add(mesh);

  let mouse = 0;
  addEventListener('pointermove', e => { mouse += (e.clientX / innerWidth - .5 - mouse) * .08; }, { passive: true });
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  addEventListener('resize', resize);
  resize();
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draw = now => {
    const t = now / 1000;
    mesh.rotation.y = Math.sin(t * .6) * .3 + mouse * .7;
    mesh.position.y = Math.sin(t * 1.1) * 1.4;
    renderer.render(scene, camera);
    if (!still) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
