/* Live menu: the same tree and the same keys as the mod. */
const theme = { h1: '#1fa35b', h2: '#0e5c33', image: null };
const demo = (() => {
  const stage = $('#stage'), vt = $('#vt'), side = $('#vtSide');
  const stack = [{ menu: MENU, sel: 0 }];
  const on = new Set(['Invincible']);
  const pick = new Map();
  let notice = '', noticeTimer = 0, busy = false;
  const ROWS = 11;

  const say = text => {
    notice = text; clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => { notice = ''; render(); }, 2500);
  };
  const label = e => L(e.type === 'sub' ? e.menu.title : e.label);
  const value = e => {
    if (e.type === 'sub') return '<em>&gt;</em>';
    if (e.type === 'toggle') return on.has(e.label) ? '<em class="y">ON</em>' : '<em class="n">OFF</em>';
    if (e.type === 'choice') return `<em>&lt; ${L(e.options[pick.get(e.label) || 0])} &gt;</em>`;
    return '';
  };

  const label0 = e => e.type === 'sub' ? e.menu.title : e.label;
  const render = () => {
    const top = stack[stack.length - 1], list = top.menu.entries;
    const visible = Math.min(list.length, ROWS);
    const first = Math.max(0, Math.min(top.sel - (visible >> 1), list.length - visible));
    const rows = list.slice(first, first + visible).map((e, i) =>
      `<div class="vt-row${first + i === top.sel ? ' on' : ''}" data-i="${first + i}"><span>${label(e)}</span>${value(e)}</div>`).join('');
    vt.innerHTML = `
      <div class="vt-head" style="--h1:${theme.h1};--h2:${theme.h2}">${theme.image ? `<img src="${theme.image}" alt="">` : '<b>VESSEL TRAINER</b>'}<i>v2.5.0</i></div>
      <div class="vt-bar"><span>${L(top.menu.title)}</span><span>${top.sel + 1} / ${list.length}</span></div>
      ${rows}
      <div class="vt-bar" style="justify-content:center"><span style="color:#a8a8a8">${tr('Enter: OK  ·  Backspace: back', 'Entrée : OK  ·  Effacer : retour')}</span></div>
      <div class="vt-desc">${describe(label0(list[top.sel]), top.menu.title)}</div>
      ${notice ? `<div class="vt-notice">${notice}</div>` : ''}`;
    side.style.setProperty('--h1', theme.h1);
    side.innerHTML = [...on].map(n => `<span>${L(n)}</span>`).join('');
  };

  const nuke = () => {
    if (busy) return;
    busy = true;
    const count = $('#vtCount'), flash = $('#vtFlash'), bg = $('#stageBg');
    let n = 3;
    const tick = () => {
      if (n > 0) { count.textContent = n--; setTimeout(tick, calm ? 300 : 800); return; }
      count.textContent = '';
      bg.src = 'assets/img/bombe_3.webp';
      flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
      busy = false;
    };
    say(tr('Detonation imminent, get away!', 'Détonation imminente, éloigne-toi !'));
    tick();
  };

  const activate = e => {
    if (e.type === 'sub') { stack.push({ menu: e.menu, sel: 0 }); return; }
    if (e.type === 'toggle') { on.has(e.label) ? on.delete(e.label) : on.add(e.label); return; }
    if (e.type === 'choice') { step(e, 1); return; }
    if (e.label.startsWith('Bombe')) { nuke(); return; }
    if (e.label === 'Tout désactiver') {
      on.clear(); pick.clear(); $('#stageBg').src = 'assets/img/watermark.webp'; say(tr('Trainer reset', 'Trainer réinitialisé')); return;
    }
    say(L(e.label));
  };
  const step = (e, d) => {
    const n = e.options.length;
    pick.set(e.label, ((pick.get(e.label) || 0) + d + n) % n);
  };

  const key = k => {
    const top = stack[stack.length - 1], list = top.menu.entries, e = list[top.sel];
    if (k === 'ArrowUp') top.sel = (top.sel - 1 + list.length) % list.length;
    else if (k === 'ArrowDown') top.sel = (top.sel + 1) % list.length;
    else if (k === 'ArrowLeft' && e.type === 'choice') step(e, -1);
    else if (k === 'ArrowRight' && e.type === 'choice') step(e, 1);
    else if (k === 'Enter') activate(e);
    else if (k === 'Backspace') { if (stack.length > 1) stack.pop(); }
    else return false;
    render();
    return true;
  };

  stage.addEventListener('keydown', e => { if (key(e.key)) e.preventDefault(); });
  vt.addEventListener('click', e => {
    stage.focus({ preventScroll: true });
    const row = e.target.closest('.vt-row');
    if (!row) return;
    const top = stack[stack.length - 1];
    top.sel = +row.dataset.i;
    activate(top.menu.entries[top.sel]);
    render();
  });
  document.querySelectorAll('.pad button').forEach(b => b.addEventListener('click', () => key(b.dataset.k)));
  onLang(render);
  return { render };
})();



/* Store buttons only become links once the project page exists. */
onLang(() => document.querySelectorAll('[data-store]').forEach(button => {
  const url = STORE_LINKS[button.dataset.store];
  const name = button.dataset.store === 'curseforge' ? 'CurseForge' : 'Modrinth';
  if (url) {
    button.href = url;
    button.textContent = name;
    button.hidden = false;
  } else if (button.dataset.store === 'modrinth') {
    button.hidden = true;
  } else {
    button.classList.add('soon');
    button.setAttribute('aria-disabled', 'true');
    button.textContent = `${name} · ${tr('soon', 'bientôt')}`;
  }
}));

/* Screenshots show the trainer in the language of the page. */
onLang(() => document.querySelectorAll('img[data-shot]').forEach(img => { img.src = `assets/img/${lang}/${img.dataset.shot}.webp`; }));

/* The voxel world: one set of cubes that reshapes itself between six forms. */
const world = (() => {
  const canvas = $('#world');
  const small = innerWidth < 760;
  const COUNT = small ? 4000 : 12000;
  const rand = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const hex = c => [(c >> 16 & 255) / 255, (c >> 8 & 255) / 255, (c & 255) / 255];
  const pick = list => list[Math.floor(rand() * list.length)];

  const island = () => {
    const out = [];
    const R = 31;
    for (let x = -R; x <= R; x++) for (let z = -R; z <= R; z++) {
      const d = Math.hypot(x, z) / R;
      const edge = d + Math.sin(Math.atan2(z, x) * 5) * .08;
      if (edge > 1) continue;
      const top = Math.round(Math.sin(x * .22) * 1.6 + Math.cos(z * .19) * 1.6 + (1 - d) * 4);
      out.push([x, top, z, pick([0x6fcf5b, 0x5fc04f, 0x7bd968])]);
      out.push([x, top - 1, z, 0x9a6b43]);
      const depth = Math.round((1 - edge) * 13);
      for (let y = 2; y < depth; y += 2) out.push([x, top - y, z, pick([0x8d8f96, 0x7c7e86, 0x9a6b43])]);
      if (rand() < .012 && d < .8) {
        for (let y = 1; y < 5; y++) out.push([x, top + y, z, 0x7a5230]);
        for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let c = 0; c < 3; c++)
          if (Math.abs(a) + Math.abs(b) + c < 5) out.push([x + a, top + 5 + c, z + b, pick([0x2f9e58, 0x38b268])]);
      }
    }
    return { list: out };
  };

  const pyramid = () => {
    const out = [];
    for (let layer = 0; layer < 24; layer++) {
      const size = 25 - layer;
      for (let x = -size; x <= size; x++) for (let z = -size; z <= size; z++)
        if (Math.abs(x) === size || Math.abs(z) === size || (layer % 6 === 0 && rand() < .15))
          out.push([x, layer * 1.25 - 15, z, pick([0xf1d39a, 0xe8c684, 0xf5dcae])]);
    }
    return { list: out };
  };

  const tornado = () => {
    const out = [];
    for (let i = 0; i < 12000; i++) {
      const h = Math.pow(rand(), .8);
      const a = rand() * 6.28;
      const band = 1 + Math.sin(a * 3 + h * 16) * .16;
      const r = (2.2 + h * h * 27) * band + rand() * 1.6;
      out.push([Math.cos(a) * r, h * 60 - 27, Math.sin(a) * r, pick([0x6f7a89, 0x8a95a3, 0xa4aeba, 0x5c4a3c])]);
    }
    for (let i = 0; i < 700; i++) {
      const a = rand() * 6.28, r = 3 + rand() * 18;
      out.push([Math.cos(a) * r, -28 + rand() * 3, Math.sin(a) * r, pick([0x8a6a4a, 0x6d5a4a])]);
    }
    return { list: out, spin: 1.5, size: 1.5 };
  };

  const galaxy = () => {
    const out = [];
    for (let i = 0; i < 11000; i++) {
      const arm = Math.floor(rand() * 3);
      const r = 7 + Math.pow(rand(), .7) * 30;
      const a = arm * 2.094 + r * .22 + (rand() - .5) * .55;
      const hot = 1 - r / 37;
      out.push([Math.cos(a) * r, (rand() - .5) * (5 - hot * 3), Math.sin(a) * r, hot > .55 ? 0xffd27a : hot > .25 ? 0xff7ad0 : 0x7c6bff]);
    }
    for (let i = 0; i < 700; i++) {
      const u = rand() * 6.28, v = Math.acos(rand() * 2 - 1), r = 5.6;
      out.push([Math.sin(v) * Math.cos(u) * r, Math.cos(v) * r, Math.sin(v) * Math.sin(u) * r, 0x05040c]);
    }
    return { list: out, spin: .55, swirl: true, tilt: .42, size: 1.15 };
  };

  const mushroom = () => {
    const out = [];
    const fire = [0xff8a2a, 0xffb338, 0xff5a2a, 0xffd85c];
    const smoke = [0x6a6058, 0x87786c, 0x4f4a48];
    for (let i = 0; i < 3200; i++) {
      const h = rand(), a = rand() * 6.28, r = Math.sqrt(rand()) * (4.6 + (1 - h) * (1 - h) * 8);
      out.push([Math.cos(a) * r, h * 33 - 26, Math.sin(a) * r, h < .3 ? pick(fire) : pick(rand() < .5 ? fire : smoke)]);
    }
    for (let i = 0; i < 7800; i++) {
      const a = rand() * 6.28, t = rand() * 6.28, q = 9.5 * Math.sqrt(rand());
      const out2 = 15 + Math.cos(t) * q, up = Math.sin(t) * q * .85;
      out.push([Math.cos(a) * out2, 13 + up, Math.sin(a) * out2, rand() < .55 ? pick(fire) : pick(smoke)]);
    }
    for (let i = 0; i < 1400; i++) {
      const a = rand() * 6.28, r = 10 + rand() * 20;
      out.push([Math.cos(a) * r, -26 + rand() * rand() * 7, Math.sin(a) * r, pick(smoke)]);
    }
    return { list: out, spin: .12, size: 2 };
  };

  const vess = () => ({ list: vessVoxels().map(v => [v[0] * 1.25, v[1] * 1.25, v[2] * 1.25, v[3], v[4]]), bob: true, size: 1.25 });

  /* Sorting by height keeps neighbors together, so a form melts into the next instead of scrambling. */
  const shapes = [island(), pyramid(), tornado(), galaxy(), mushroom(), vess()].map(shape => {
    const list = shape.list.slice().sort((a, b) => a[1] - b[1]);
    const data = new Float32Array(COUNT * 7);
    for (let i = 0; i < COUNT; i++) {
      const v = list[Math.floor(i * list.length / COUNT)];
      const c = hex(v[3]);
      data.set([v[0], v[1], v[2], c[0], c[1], c[2], v[4] || 0], i * 7);
    }
    return { ...shape, data };
  });

  const delay = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) delay[i] = rand() * .35 + (i / COUNT) * .25;

  const state = { progress: 0, x: 0, mouseX: 0, mouseY: 0, ok: false };
  if (!window.THREE) return state;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small, powerPreference: 'high-performance' });
  } catch { return state; }
  state.ok = true;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 1, 600);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x93a7c0, 1.9));
  const sun = new THREE.DirectionalLight(0xfff2dd, 2.4);
  sun.position.set(40, 70, 50);
  scene.add(sun);

  const starPoints = new Float32Array(1400 * 3);
  for (let i = 0; i < starPoints.length; i++) starPoints[i] = (rand() - .5) * 520;
  const starShape = new THREE.BufferGeometry();
  starShape.setAttribute('position', new THREE.BufferAttribute(starPoints, 3));
  const stars = new THREE.Points(starShape, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 1.1, transparent: true, opacity: .75 }));
  stars.position.z = -90;
  scene.add(stars);

  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial(), COUNT);
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  const group = new THREE.Group();
  group.add(mesh);
  scene.add(group);

  const resize = () => {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.set(0, 26, w < 760 ? 225 : 150);
    camera.lookAt(0, 2, 0);
    camera.updateProjectionMatrix();
  };
  addEventListener('resize', resize);
  resize();

  const smooth = t => t * t * (3 - 2 * t);
  const matrix = mesh.instanceMatrix.array, colors = mesh.instanceColor.array;

  /* Writes one voxel's animated position for a form into out[0..2]. */
  const out = [0, 0, 0];
  const place = (shape, d, i, t) => {
    let x = d[i], y = d[i + 1], z = d[i + 2];
    if (shape.spin) {
      const r = Math.hypot(x, z) || 1;
      const a = t * shape.spin * (shape.swirl ? 12 / (r + 6) : 1);
      const c = Math.cos(a), s = Math.sin(a), nx = x * c - z * s;
      z = x * s + z * c; x = nx;
    }
    if (shape.tilt) { const ny = y + z * shape.tilt; z = z - y * shape.tilt; y = ny; }
    if (shape.bob) {
      const flag = d[i + 6];
      if (flag === 1) y += Math.sin(x * .45 + t * 2) * .5;
      if (flag === 3) {
        const a = t * .5, c = Math.cos(a), s = Math.sin(a), nx = x * c - z * s;
        z = x * s + z * c; x = nx;
        y += Math.sin(t + d[i]) * 2;
      }
      y += Math.sin(t * 1.1) * 1.6;
    } else {
      y += Math.sin(t * .7) * 1.1;
    }
    out[0] = x; out[1] = y; out[2] = z;
  };

  const frame = t => {
    const p = Math.min(shapes.length - 1, Math.max(0, state.progress));
    const index = Math.min(shapes.length - 2, Math.floor(p));
    const local = p - index;
    const from = shapes[index], to = shapes[index + 1];
    const a = from.data, b = to.data;
    const sizeA = from.size || 1, sizeB = to.size || 1;
    const blink = to.bob && local > .98 && t % 4.2 < .16;

    for (let n = 0; n < COUNT; n++) {
      const i = n * 7;
      const k = smooth(Math.min(1, Math.max(0, (local * 1.6 - delay[n]))));
      place(from, a, i, t);
      const ax = out[0], ay = out[1], az = out[2];
      place(to, b, i, t);
      const lift = Math.sin(k * Math.PI);
      const twist = lift * 1.1, c = Math.cos(twist), s = Math.sin(twist);
      const mx = ax + (out[0] - ax) * k, mz = az + (out[2] - az) * k;
      const m = n * 16;
      matrix[m] = matrix[m + 5] = matrix[m + 10] = (sizeA + (sizeB - sizeA) * k) * (1 - lift * .25);
      matrix[m + 12] = mx * c - mz * s;
      matrix[m + 13] = ay + (out[1] - ay) * k + lift * 9;
      matrix[m + 14] = mx * s + mz * c;
      matrix[m + 15] = 1;
      const q = n * 3;
      colors[q] = a[i + 3] + (b[i + 3] - a[i + 3]) * k;
      colors[q + 1] = a[i + 4] + (b[i + 4] - a[i + 4]) * k;
      colors[q + 2] = a[i + 5] + (b[i + 5] - a[i + 5]) * k;
      if (blink && b[i + 6] === 2) { colors[q] = .54; colors[q + 1] = .3; colors[q + 2] = 1; }
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;

    group.position.x = state.x;
    group.position.y = small ? 20 : 0;
    /* Everything turns slowly, except Vess, who ends up facing the visitor. */
    const facing = smooth(Math.min(1, Math.max(0, p - 4)));
    group.rotation.y = (p * .9 + t * .05) * (1 - facing) + facing * Math.sin(t * .6) * .22 + state.mouseX * (.22 + facing * .45);
    stars.rotation.y = t * .006;
    group.rotation.x = state.mouseY * .1;
    renderer.render(scene, camera);
  };
  state.render = frame;

  addEventListener('pointermove', e => {
    gsap.to(state, { mouseX: e.clientX / innerWidth - .5, mouseY: e.clientY / innerHeight - .5, duration: 1.2, ease: 'power3.out', overwrite: 'auto' });
  }, { passive: true });

  if (calm) { frame(0); return state; }
  const loop = now => { if (!document.hidden && !state.paused) frame(now / 1000); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  return state;
})();

/* Scroll drives everything. */
(() => {
  const chapters = [...document.querySelectorAll('.chapter')];
  const dots = $('#dots');
  dots.innerHTML = chapters.map(() => '<i></i>').join('');
  const skies = [['#060914', '#131d44'], ['#120c08', '#4a2c12'], ['#090d14', '#2a3644'], ['#08061c', '#2d1560'], ['#150812', '#7c2c1a'], ['#07061a', '#28156a']];
  const top = gsap.utils.interpolate(skies.map(s => s[0])), bottom = gsap.utils.interpolate(skies.map(s => s[1]));
  const sides = [0, -26, 26, -26, 26, -26];
  const side = i => (innerWidth < 760 ? 0 : sides[i]);

  const apply = progress => {
    const last = chapters.length - 1;
    const v = gsap.utils.clamp(0, last, progress);
    world.progress = v;
    const f = Math.floor(v), next = Math.min(last, f + 1), k = v - f;
    world.x = side(f) + (side(next) - side(f)) * k * k * (3 - 2 * k);
    const root = document.documentElement.style;
    root.setProperty('--a', top(v / last));
    root.setProperty('--b', bottom(v / last));
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i === Math.round(v)));
    if (calm && world.render) world.render(0);
  };
  apply(0);

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  if (!calm && window.Lenis) {
    const lenis = new Lenis({ lerp: .08, wheelMultiplier: .9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { duration: 2 }); }
    }));
  }

  ScrollTrigger.create({ trigger: '#story', start: 'top top', end: 'bottom bottom', onUpdate: s => apply(s.progress * (chapters.length - 1)) });

  /* The 3D stops drawing once the white pages cover it. */
  ScrollTrigger.create({ trigger: '.solid', start: 'top top', onToggle: s => { world.paused = s.isActive; $('#dots').style.opacity = s.isActive ? 0 : 1; } });

  if (calm) return;

  gsap.fromTo('#title span', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4, stagger: .12, ease: 'expo.out' });
  gsap.from('#world', { opacity: 0, scale: .9, duration: 1.8, ease: 'expo.out' });
  gsap.to('#title', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero-ch', start: 'top top', end: '60% top', scrub: true } });

  document.querySelectorAll('.chapter:not(.hero-ch) .copy').forEach(copy => {
    gsap.timeline({ scrollTrigger: { trigger: copy.parentNode, start: 'top 75%', end: 'bottom 25%', scrub: true } })
      .fromTo(copy, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: .25, ease: 'power2.out' })
      .to(copy, { opacity: 1, duration: .5 })
      .to(copy, { opacity: 0, y: -70, duration: .25, ease: 'power2.in' });
  });

  /* Each screenshot shrinks back as the next one slides over it. */
  const cards = gsap.utils.toArray('.card');
  cards.slice(0, -1).forEach((card, i) => {
    gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, { scale: .92, filter: 'brightness(.72)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 92px', scrub: true } });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
