/* ============================================================
VibeForma landing — exact port of the approved prototype (site-1).
Particle entity + scroll choreography, libraries from npm.
Localized strings come from the #vf-i18n JSON block in the page.
============================================================ */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';

const i18n = (() => {
try {
return JSON.parse(document.getElementById('vf-i18n')?.textContent || '{}');
} catch {
return {};
}
})();
const tr = (key, fallback) => i18n[key] || fallback;

gsap.registerPlugin(ScrollTrigger, SplitText);
/* ---------------- CONFIG (the knobs) ---------------- */
const CONFIG = {
ease: 'expo.out',          // ONE motion personality (mirror --ease in CSS)
revealDur: 1.2,
scrollWeight: 1.35,        // Lenis duration — higher = heavier, driftier
counts: { desktop: 15000, mobile: 5000 },
pointSize: 3.0,
idleJitter: 0.05,          // constant breathing (keep small — blurs fine shapes)
stormAmp: 1.05,            // scatter at the middle of a morph
flowFreq: 0.2,             // noise wavelength — LOWER = smoother, more liquid
velocityTurb: 0.3,
morphScrub: 1.2,           // inertia on the morph scrub
bloom: { strength: 0.85, radius: 0.55, threshold: 0.12 },
glitchVelocity: 55,        // |lenis velocity| that triggers the RGB glitch
mouse: { radius: 2.6, force: 1.0 }, // cursor repulsion field
lines: { max: 300, opacity: 0.13 }, // constellation segments per shape
trailDamp: { base: 0.35, storm: 0.45, burst: 0.5 }, // afterimage strength
intro: { z: -11, spin: 1.2, duration: 2.8 },        // fly-through
};
const EASE = CONFIG.ease;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 768px)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
if (reduced) document.documentElement.classList.add('no-motion');
/* ============================================================
1) LENIS ↔ SCROLLTRIGGER — one shared scroll position.
============================================================ */
let lenis = null;
let scrollVelocity = 0;
let glitchCooldown = 0;
if (!reduced) {
lenis = new Lenis({
duration: CONFIG.scrollWeight,
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out feel
smoothWheel: true,
});
lenis.on('scroll', (e) => {
ScrollTrigger.update();
scrollVelocity = Math.abs(e.velocity || 0);
audio.velocity(scrollVelocity);
// scroll-velocity RGB glitch
const now = performance.now();
if (scrollVelocity > CONFIG.glitchVelocity && now > glitchCooldown) {
glitchCooldown = now + 600;
document.querySelectorAll('.glitch').forEach((el) => {
const r = el.getBoundingClientRect();
if (r.bottom < 0 || r.top > innerHeight) return;
el.classList.add('glitch-active');
setTimeout(() => el.classList.remove('glitch-active'), 260);
});
}
});
gsap.ticker.add((time) => lenis.raf(time * 1000)); // single loop
gsap.ticker.lagSmoothing(0);
lenis.stop(); // locked until the preloader finishes
document.querySelectorAll('a[href^="#"]').forEach((a) => {
a.addEventListener('click', (e) => {
const target = document.querySelector(a.getAttribute('href'));
if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: 0 }); }
});
});
}
/* ============================================================
2) AUDIO — synthesized ambience, opt-in.
============================================================ */
const audio = (() => {
let ctx = null, master = null, filter = null, humGain = null;
const oscs = [];
let enabled = false, ready = false;
function setup() {
const AC = window.AudioContext || window.webkitAudioContext;
if (!AC) return false;
ctx = new AC();
master = ctx.createGain();
master.gain.value = 0;
master.connect(ctx.destination);
filter = ctx.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.value = 420;
filter.Q.value = 0.8;
filter.connect(master);
humGain = ctx.createGain();
humGain.gain.value = 0.055;
humGain.connect(filter);
[[46, 'sine', 1], [46.55, 'sine', 1], [92.6, 'triangle', 0.14]].forEach(([f, type, g]) => {
const o = ctx.createOscillator();
o.type = type;
o.frequency.value = f;
const og = ctx.createGain();
og.gain.value = g;
o.connect(og);
og.connect(humGain);
o.start();
oscs.push(o);
});
// slow swell so the hum never feels static
const lfo = ctx.createOscillator();
lfo.frequency.value = 0.08;
const lfoGain = ctx.createGain();
lfoGain.gain.value = 0.02;
lfo.connect(lfoGain);
lfoGain.connect(humGain.gain);
lfo.start();
ready = true;
return true;
}
function toggle() {
if (!ready && !setup()) return false;
ctx.resume();
enabled = !enabled;
master.gain.setTargetAtTime(enabled ? 0.55 : 0, ctx.currentTime, 0.4);
return enabled;
}
/* the hum re-tunes per section */
function setEpoch(i) {
if (!ready || !enabled || isNaN(i)) return;
const base = 42 + i * 6;
oscs[0].frequency.setTargetAtTime(base, ctx.currentTime, 1.4);
oscs[1].frequency.setTargetAtTime(base * 1.012, ctx.currentTime, 1.4);
oscs[2].frequency.setTargetAtTime(base * 2.01, ctx.currentTime, 1.4);
}
/* soft blip on section change */
function tick() {
if (!ready || !enabled) return;
const t = ctx.currentTime;
const o = ctx.createOscillator();
o.type = 'sine';
o.frequency.setValueAtTime(1150, t);
o.frequency.exponentialRampToValueAtTime(520, t + 0.12);
const g = ctx.createGain();
g.gain.setValueAtTime(0.0001, t);
g.gain.exponentialRampToValueAtTime(0.05, t + 0.012);
g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
o.connect(g);
g.connect(master);
o.start(t);
o.stop(t + 0.2);
}
/* filtered-noise whoosh for the burst */
function whoosh() {
if (!ready || !enabled) return;
const t = ctx.currentTime, dur = 1.4;
const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
const d = buf.getChannelData(0);
for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
const src = ctx.createBufferSource();
src.buffer = buf;
const bp = ctx.createBiquadFilter();
bp.type = 'bandpass';
bp.Q.value = 1.1;
bp.frequency.setValueAtTime(280, t);
bp.frequency.exponentialRampToValueAtTime(1800, t + 0.25);
bp.frequency.exponentialRampToValueAtTime(120, t + dur);
const g = ctx.createGain();
g.gain.setValueAtTime(0.001, t);
g.gain.exponentialRampToValueAtTime(0.2, t + 0.15);
g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
src.connect(bp);
bp.connect(g);
g.connect(master);
src.start(t);
}
/* scroll speed opens the lowpass */
function velocity(v) {
if (!ready || !enabled) return;
filter.frequency.setTargetAtTime(Math.min(2400, 420 + v * 22), ctx.currentTime, 0.25);
}
return { toggle, setEpoch, tick, whoosh, velocity };
})();
function initSoundToggle() {
const buttons = [document.getElementById('sndToggle'), document.getElementById('sndToggleMobile')]
.filter(Boolean);
if (!buttons.length) return;
const sync = (on) => buttons.forEach((btn) => {
btn.classList.toggle('is-on', on);
btn.setAttribute('aria-pressed', String(on));
btn.querySelector('em').textContent = on ? tr('soundOn', 'ON') : tr('soundOff', 'OFF');
});
buttons.forEach((btn) => btn.addEventListener('click', () => sync(audio.toggle())));
}
/* ============================================================
3) THE ENTITY — shape targets
============================================================ */
const COUNT = isMobile ? CONFIG.counts.mobile : CONFIG.counts.desktop;
const rand = Math.random;
const gauss = () => (rand() + rand() + rand() - 1.5) * 0.8;
function rotX(arr, a) {
const c = Math.cos(a), s = Math.sin(a);
for (let i = 0; i < arr.length; i += 3) {
const y = arr[i + 1], z = arr[i + 2];
arr[i + 1] = y * c - z * s;
arr[i + 2] = y * s + z * c;
}
return arr;
}
function rotY(arr, a) {
const c = Math.cos(a), s = Math.sin(a);
for (let i = 0; i < arr.length; i += 3) {
const x = arr[i], z = arr[i + 2];
arr[i] = x * c + z * s;
arr[i + 2] = -x * s + z * c;
}
return arr;
}
function rotZ(arr, a) {
const c = Math.cos(a), s = Math.sin(a);
for (let i = 0; i < arr.length; i += 3) {
const x = arr[i], y = arr[i + 1];
arr[i] = x * c - y * s;
arr[i + 1] = x * s + y * c;
}
return arr;
}
/* random point on a sphere shell between rMin..rMax — ambient halos */
function haloPoint(a, i3, rMin, rMax) {
let x = gauss(), y = gauss(), z = gauss();
const n = Math.hypot(x, y, z) || 1;
const r = rMin + rand() * (rMax - rMin);
a[i3] = (x / n) * r; a[i3 + 1] = (y / n) * r; a[i3 + 2] = (z / n) * r;
}
/* 0 · orbital gyroscope: three nested rings + core + dust halo. */
const ringId = new Float32Array(COUNT);
function shapeGyroscope() {
const a = new Float32Array(COUNT * 3);
const rings = [
{ r: 6.4, tx: -0.5, tz: 0.0 },
{ r: 5.3, tx: 0.9, tz: 0.7 },
{ r: 4.2, tx: 0.25, tz: -1.1 },
];
for (let i = 0; i < COUNT; i++) {
const i3 = i * 3;
const pick = rand();
if (pick < 0.12) { ringId[i] = 4; haloPoint(a, i3, 7.5, 13); continue; } // far dust
if (pick < 0.24) { // dense core
ringId[i] = 3;
let x = gauss(), y = gauss(), z = gauss();
const n = Math.hypot(x, y, z) || 1;
const r = 1.7 * Math.cbrt(rand());
a[i3] = (x / n) * r; a[i3 + 1] = (y / n) * r; a[i3 + 2] = (z / n) * r;
continue;
}
ringId[i] = i % 3;
const ring = rings[i % 3];
const ang = rand() * Math.PI * 2;
const x = Math.cos(ang) * ring.r + gauss() * 0.07;
const y = gauss() * 0.07;
const z = Math.sin(ang) * ring.r + gauss() * 0.07;
let y2 = y * Math.cos(ring.tx) - z * Math.sin(ring.tx);
const z2 = y * Math.sin(ring.tx) + z * Math.cos(ring.tx);
const x2 = x * Math.cos(ring.tz) - y2 * Math.sin(ring.tz);
y2 = x * Math.sin(ring.tz) + y2 * Math.cos(ring.tz);
a[i3] = x2; a[i3 + 1] = y2; a[i3 + 2] = z2;
}
return a;
}
/* 1 · a dense star with a thin corona */
function shapeStar() {
const a = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
const i3 = i * 3;
let x = gauss(), y = gauss(), z = gauss();
const n = Math.hypot(x, y, z) || 1;
x /= n; y /= n; z /= n;
const r = rand() < 0.85
? 3.4 * Math.cbrt(rand())
: 3.4 + Math.pow(rand(), 2.4) * 5.6;
a[i3] = x * r; a[i3 + 1] = y * r; a[i3 + 2] = z * r;
}
return a;
}
/* 2 · a ringed planet */
function shapePlanet() {
const a = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
const i3 = i * 3;
if (rand() < 0.76) {
let x = gauss(), y = gauss(), z = gauss();
const n = Math.hypot(x, y, z) || 1;
const r = 3.1 + (rand() - 0.5) * 0.08;
a[i3] = (x / n) * r; a[i3 + 1] = (y / n) * r; a[i3 + 2] = (z / n) * r;
} else {
const rr = 4.4 + rand() * 2.1;
const ang = rand() * Math.PI * 2;
a[i3] = Math.cos(ang) * rr;
a[i3 + 1] = (rand() - 0.5) * 0.1;
a[i3 + 2] = Math.sin(ang) * rr;
}
}
return rotZ(rotX(a, -0.4), 0.16);
}
/* 3 · an ocean of interfering waves, tipped toward the viewer */
function shapeWaves() {
const a = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
const i3 = i * 3;
const x = (rand() - 0.5) * 17;
const z = (rand() - 0.5) * 11;
a[i3] = x;
a[i3 + 1] = Math.sin(x * 0.55 + z * 0.35) * 0.9
+ Math.sin(x * 1.15 - z * 0.6) * 0.45
+ Math.sin(z * 1.7) * 0.25;
a[i3 + 2] = z;
}
return rotX(a, -0.5);
}
/* 4 · a wider DNA double helix, wrapped in nucleotide dust */
function shapeHelix() {
const a = new Float32Array(COUNT * 3);
const R = 2.7, TURNS = 4.2, H = 11.5;
for (let i = 0; i < COUNT; i++) {
const i3 = i * 3;
const pick = rand();
if (pick < 0.12) { // ambient dust cylinder around the molecule
const ang = rand() * Math.PI * 2;
const rr = 3.8 + rand() * 3.2;
a[i3] = Math.cos(ang) * rr;
a[i3 + 1] = (rand() - 0.5) * (H + 3);
a[i3 + 2] = Math.sin(ang) * rr;
continue;
}
const u = rand();
const ang = u * Math.PI * 2 * TURNS;
const y = (u - 0.5) * H;
if (pick < 0.9) { // the two strands
const ph = (i % 2) * Math.PI;
a[i3] = Math.cos(ang + ph) * R + (rand() - 0.5) * 0.09;
a[i3 + 1] = y;
a[i3 + 2] = Math.sin(ang + ph) * R + (rand() - 0.5) * 0.09;
} else { // rungs bridging the strands
const s = rand();
const x1 = Math.cos(ang) * R, z1 = Math.sin(ang) * R;
const x2 = Math.cos(ang + Math.PI) * R, z2 = Math.sin(ang + Math.PI) * R;
a[i3] = x1 + (x2 - x1) * s;
a[i3 + 1] = y;
a[i3 + 2] = z1 + (z2 - z1) * s;
}
}
return a;
}
/* 5 · a comet: dense head streaking across the night,
with a curved widening tail */
function shapeComet() {
const a = new Float32Array(COUNT * 3);
// quadratic bezier spine: head → arc → tail end
const P0 = [4.4, 2.2, 0], P1 = [0.4, 3.0, 0.9], P2 = [-8.2, -3.0, -0.6];
for (let i = 0; i < COUNT; i++) {
const i3 = i * 3;
const pick = rand();
if (pick < 0.2) { // the head — hot and dense
let x = gauss(), y = gauss(), z = gauss();
const n = Math.hypot(x, y, z) || 1;
const r = 1.0 * Math.cbrt(rand());
a[i3] = P0[0] + (x / n) * r;
a[i3 + 1] = P0[1] + (y / n) * r;
a[i3 + 2] = P0[2] + (z / n) * r;
continue;
}
if (pick < 0.28) { haloPoint(a, i3, 8, 13); continue; } // night dust
// the tail — density and spread grow along the arc
const t = Math.pow(rand(), 1.35);
const it = 1 - t;
const spread = 0.12 + t * 2.3;
a[i3] = it * it * P0[0] + 2 * it * t * P1[0] + t * t * P2[0] + gauss() * spread;
a[i3 + 1] = it * it * P0[1] + 2 * it * t * P1[1] + t * t * P2[1] + gauss() * spread;
a[i3 + 2] = it * it * P0[2] + 2 * it * t * P1[2] + t * t * P2[2] + gauss() * spread * 0.5;
}
return a;
}
/* 6 · the transmission: a hot core inside concentric shells
that the shader radiates outward in a loop.
Shell spacing here must match SIGNAL_GAP used in the shader. */
function shapeSignal() {
const a = new Float32Array(COUNT * 3);
const R0 = 1.8, GAP = 1.35, SHELLS = 5;
for (let i = 0; i < COUNT; i++) {
const i3 = i * 3;
const pick = rand();
let x = gauss(), y = gauss(), z = gauss();
const n = Math.hypot(x, y, z) || 1;
x /= n; y /= n; z /= n;
if (pick < 0.12) { // the emitting core
const r = 1.2 * Math.cbrt(rand());
a[i3] = x * r; a[i3 + 1] = y * r; a[i3 + 2] = z * r;
} else if (pick < 0.84) { // discrete wavefront shells
const k = Math.floor(rand() * SHELLS);
const r = R0 + k * GAP + (rand() - 0.5) * 0.07;
a[i3] = x * r; a[i3 + 1] = y * r; a[i3 + 2] = z * r;
} else { // faint listening field beyond the wavefronts
haloPoint(a, i3, 9, 13);
}
}
return a;
}
/* 7 · Earth: an ocean-blue sphere with round continents
(per-point land tint via aTint), a thin atmosphere shell, and
day/night shading + slow rotation applied in the shader/frame */
const earthTint = new Float32Array(COUNT); // 1 = land, 0 = ocean/atmosphere
function shapeEarth() {
const a = new Float32Array(COUNT * 3);
const R = 4.6;
// continents: a handful of circular caps on the sphere, ragged edges
const caps = [];
for (let k = 0; k < 8; k++) {
let x = gauss(), y = gauss(), z = gauss();
const n = Math.hypot(x, y, z) || 1;
caps.push({ x: x / n, y: y / n, z: z / n, t: 0.74 + rand() * 0.12 });
}
const jitter = (x, y, z) => {
const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
return (s - Math.floor(s)) * 0.08;
};
for (let i = 0; i < COUNT; i++) {
const i3 = i * 3;
let x = gauss(), y = gauss(), z = gauss();
const n = Math.hypot(x, y, z) || 1;
x /= n; y /= n; z /= n;
if (rand() < 0.1) { // atmosphere shell
const r = R + 0.35 + Math.pow(rand(), 2) * 1.3;
a[i3] = x * r; a[i3 + 1] = y * r; a[i3 + 2] = z * r;
earthTint[i] = 0;
continue;
}
const r = R + (rand() - 0.5) * 0.08;
a[i3] = x * r; a[i3 + 1] = y * r; a[i3 + 2] = z * r;
let land = 0;
for (const c of caps) {
if (x * c.x + y * c.y + z * c.z > c.t + jitter(x, y, z)) { land = 1; break; }
}
earthTint[i] = land;
}
return a;
}
const shapes = [
shapeGyroscope(), shapeStar(), shapePlanet(), shapeWaves(),
shapeHelix(), shapeComet(), shapeSignal(), shapeEarth(),
];
/* per-shape entity color, camera distance, x-drift */
const SHAPE_STYLE = [
{ color: '#7fd4ff', camZ: 14.5, offX: 0 },
{ color: '#ff8a5b', camZ: 13.5, offX: 0 },
{ color: '#c9a06a', camZ: 14.5, offX: 2.0 },
{ color: '#4fb6e0', camZ: 13.0, offX: 2.4 },
{ color: '#5bf0d8', camZ: 12.5, offX: 1.8 },
{ color: '#e08ab8', camZ: 13.5, offX: -0.8 },
{ color: '#a78bfa', camZ: 14.5, offX: 0 },
{ color: '#3d7fd6', camZ: 16.0, offX: 0 },
];
const EARTH_LAND = new THREE.Color('#66e0b8'); // continent tint
const shapeColors = SHAPE_STYLE.map((s) => new THREE.Color(s.color));
/* ---- constellation pairs: shortest neighbour links per shape ---- */
function buildLinePairs(shape) {
const M = Math.min(420, COUNT);
const step = Math.max(1, Math.floor(COUNT / M));
const idx = [];
for (let i = 0; i < COUNT; i += step) idx.push(i);
const cands = [];
const maxD2 = 1.7 * 1.7;
for (let i = 0; i < idx.length; i++) {
const a3 = idx[i] * 3;
for (let j = i + 1; j < idx.length; j++) {
const b3 = idx[j] * 3;
const dx = shape[a3] - shape[b3];
const dy = shape[a3 + 1] - shape[b3 + 1];
const dz = shape[a3 + 2] - shape[b3 + 2];
const d2 = dx * dx + dy * dy + dz * dz;
if (d2 < maxD2 && d2 > 0.01) cands.push([d2, idx[i], idx[j]]);
}
}
cands.sort((a, b) => a[0] - b[0]);
return cands.slice(0, CONFIG.lines.max);
}
const linePairs = isMobile ? null : shapes.map(buildLinePairs);
/* ============================================================
3b) THE ENTITY — renderer, post pipeline, shader, controller
============================================================ */
/* GLSL: ashima 3D simplex noise (standard implementation) */
const SNOISE = /* glsl */`
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
const vec2 C = vec2(1.0/6.0, 1.0/3.0);
const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
vec3 i = floor(v + dot(v, C.yyy));
vec3 x0 = v - i + dot(i, C.xxx);
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min(g.xyz, l.zxy);
vec3 i2 = max(g.xyz, l.zxy);
vec3 x1 = x0 - i1 + C.xxx;
vec3 x2 = x0 - i2 + C.yyy;
vec3 x3 = x0 - D.yyy;
i = mod289(i);
vec4 p = permute(permute(permute(
i.z + vec4(0.0, i1.z, i2.z, 1.0))
+ i.y + vec4(0.0, i1.y, i2.y, 1.0))
+ i.x + vec4(0.0, i1.x, i2.x, 1.0));
float n_ = 0.142857142857;
vec3 ns = n_ * D.wyz - D.xzx;
vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_);
vec4 x = x_ * ns.x + ns.yyyy;
vec4 y = y_ * ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);
vec4 b0 = vec4(x.xy, y.xy);
vec4 b1 = vec4(x.zw, y.zw);
vec4 s0 = floor(b0)*2.0 + 1.0;
vec4 s1 = floor(b1)*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));
vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
vec3 p0 = vec3(a0.xy, h.x);
vec3 p1 = vec3(a0.zw, h.y);
vec3 p2 = vec3(a1.xy, h.z);
vec3 p3 = vec3(a1.zw, h.w);
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;
const VERT = /* glsl */`
attribute vec3 aPosA;     // current shape
attribute vec3 aPosB;     // next shape
attribute float aSeed;    // per-point random 0..1
attribute float aScale;   // per-point size
attribute float aTint;    // Earth finale: 1 = continent, 0 = ocean
attribute float aRing;    // gyroscope role: 0/1/2 = ring, 3 = core, 4 = halo
uniform float uMorph;     // 0..1 between A and B
uniform float uTime;
uniform float uTime2;     // variable-speed clock: idle motion runs faster in the hero
uniform float uDrift;     // extra idle amplitude (hero liveliness)
uniform float uTurb;      // scroll-velocity agitation
uniform float uHeat;      // statement charge: corona simmer + glow
uniform float uWave;      // ocean weight: rolling swell on/off
uniform float uTide;      // featured-hall scroll progress pushes the swell
uniform float uComet;     // comet weight: tail slipstream on/off
uniform float uSignal;    // transmission weight: shells radiate outward
uniform float uEarth;     // Earth finale weight: land tint + day/night shading
uniform vec3 uLand;       // continent color
uniform float uHero;      // gyroscope weight: warm core tint
uniform vec3 uCore;       // the ember heart inside the rings
uniform float uRingT;     // gimbal clock — each ring tumbles on its own axis
uniform vec3 uRing0;      // outer ring tone (deep, slow)
uniform vec3 uRing1;      // middle ring tone (anchor cyan, counter-rotating)
uniform vec3 uRing2;      // inner ring tone (palest, fastest)
uniform float uBurst;     // 0..1 click disintegration
uniform float uIdle;
uniform float uStormAmp;
uniform float uFlowFreq;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;      // cursor in the entity's local space
uniform float uMouseR;    // repulsion radius
uniform float uMouseF;    // repulsion force
uniform vec3 uColorFrom;
uniform vec3 uColorTo;
varying vec3 vColor;
varying float vTwinkle;
${SNOISE}
void main(){
float m = clamp(uMorph, 0.0, 1.0);
/* staggered departure, smoothed twice for a liquid feel */
float tt = smoothstep(0.0, 1.0, clamp((m - aSeed * 0.3) / 0.7, 0.0, 1.0));
tt = tt * tt * (3.0 - 2.0 * tt);
vec3 pos = mix(aPosA, aPosB, tt);
/* gyroscope gimbals: each ring tumbles about its own axis at its own
rate (outer slow, middle counter, inner fast). Rodrigues rotation,
blended by uHero so the motion settles out through the first morph */
if (uHero > 0.001 && aRing < 2.5) {
vec3 ax = aRing < 0.5 ? normalize(vec3(1.0, 0.18, 0.0))
: aRing < 1.5 ? normalize(vec3(0.0, 1.0, 0.22))
: normalize(vec3(0.25, 0.0, 1.0));
float ang = uRingT * (aRing < 0.5 ? 0.24 : aRing < 1.5 ? -0.38 : 0.55);
float c = cos(ang), s = sin(ang);
vec3 rp = pos * c + cross(ax, pos) * s + ax * dot(ax, pos) * (1.0 - c);
pos = mix(pos, rp, uHero);
}
/* the flow: long-wavelength noise that peaks mid-morph. */
float storm = sin(m * 3.14159265);
vec3 np = pos * uFlowFreq + vec3(uTime2 * 0.18) + aSeed * 6.28;
vec3 disp = vec3(snoise(np), snoise(np + 31.7), snoise(np + 74.3));
pos += disp * (uIdle * (1.0 + uDrift * 1.6) + storm * uStormAmp * (0.8 + aSeed) + uTurb);
/* statement heat: a boiling corona — outer particles simmer
radially on slow noise, swelling continuously with the charge. */
if (uHeat > 0.001) {
float lick = snoise(pos * 0.5 + vec3(uTime2 * 0.35) + aSeed * 9.4) * 0.5 + 0.5;
pos += normalize(pos + vec3(0.0001)) * lick * uHeat * (0.25 + aSeed * 0.85);
}
/* the living sea: rolling swells travel through the basin on the
idle clock, and uTide pushes them forward. */
if (uWave > 0.001) {
const vec3 WN = vec3(0.0, 0.8776, -0.4794); // plane normal
const vec3 WZ = vec3(0.0, 0.4794, 0.8776);  // plane depth axis
float wx = pos.x;
float wz = dot(pos, WZ);
float ph = uTide * 6.0;
float swell = sin(wx * 0.5 - uTime2 * 0.9 - ph) * 0.55
+ sin(wx * 1.1 + wz * 0.6 - uTime2 * 0.6 - ph * 0.7) * 0.3
+ snoise(vec3(wx * 0.25, wz * 0.3, uTime2 * 0.18)) * 0.45;
pos += WN * swell * uWave;
}
/* comet slipstream */
if (uComet > 0.001) {
float dh = distance(pos.xy, vec2(4.4, 2.2));      // head position
float amp = smoothstep(1.2, 9.0, dh);             // tail-only
float ph = dot(pos.xy, vec2(-0.92, -0.4));        // along-tail phase
float s1 = snoise(vec3(ph * 0.7 + uTime2 * 1.5, aSeed * 6.0, 2.3));
float s2 = snoise(vec3(ph * 1.4 + uTime2 * 2.2, aSeed * 3.0, 7.9));
pos += vec3(-0.4, 0.92, 0.15) * (s1 * 0.45 + s2 * 0.2) * amp * uComet;
pos += vec3(-0.92, -0.4, 0.0) * s2 * 0.3 * amp * uComet;
}
/* the transmission: wavefront shells glide outward and wrap back
to the core, looping seamlessly. */
float signalFade = 1.0;
if (uSignal > 0.001) {
float r0 = length(pos);
if (r0 > 1.6 && r0 < 8.8) { // shells only — core and far field stay
vec3 dir = pos / r0;
float span = 6.75; // SHELLS * GAP
float r1 = mod(r0 - 1.8 + uTime2 * 0.9, span) + 1.8;
pos = mix(pos, dir * r1, uSignal);
signalFade = mix(1.0, clamp(1.7 - r1 / 7.0, 0.2, 1.0), uSignal);
}
}
/* cursor repulsion — the cloud bends away from the pointer */
float md = distance(pos, uMouse);
pos += (pos - uMouse) / max(md, 0.001)
* smoothstep(uMouseR, 0.0, md) * uMouseF * (0.6 + aSeed * 0.8);
/* click burst: radial disintegration with a twist */
if (uBurst > 0.001) {
vec3 dir = normalize(pos + vec3(0.0001));
pos += dir * (uBurst * (1.5 + aSeed * 4.0));
float ang = uBurst * (0.6 + aSeed * 0.4);
float cx = cos(ang), sx = sin(ang);
pos = vec3(pos.x * cx - pos.z * sx, pos.y, pos.x * sx + pos.z * cx);
}
/* breathing so the entity never freezes */
float breathe = 0.04 * (1.0 + uDrift * 1.2);
pos.x += sin(uTime2 * 0.9 + aSeed * 40.0) * breathe;
pos.y += cos(uTime2 * 0.7 + aSeed * 30.0) * breathe;
vColor = mix(uColorFrom, uColorTo, tt);
/* rare white-hot + magenta sparks */
vColor = mix(vColor, vec3(1.0), step(0.985, aSeed) * 0.9);
vColor = mix(vColor, vec3(1.0, 0.24, 0.54), step(0.9982, aSeed) * 0.85);
/* the charge SATURATES the star toward deep ember-red */
vColor = mix(vColor, vec3(1.0, 0.32, 0.12), uHeat * 0.6);
/* Earth: continents tint toward land color */
vColor = mix(vColor, uLand, aTint * uEarth);
/* gyroscope: tonally stepped rings and an ember core */
if (uHero > 0.001) {
if (aRing < 2.5) {
vec3 rc = aRing < 0.5 ? uRing0 : aRing < 1.5 ? uRing1 : uRing2;
vColor = mix(vColor, rc, uHero);
}
vColor = mix(vColor, uCore, smoothstep(2.5, 1.4, length(pos)) * uHero);
}
vTwinkle = 0.6 + 0.4 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 20.0);
vTwinkle *= 1.0 + uHeat * 0.35;
vTwinkle *= signalFade; // expanding rings dim with distance
if (uEarth > 0.001) {
float shade = 0.3 + 0.7 * clamp(dot(normalize(pos + vec3(0.0001)),
normalize(vec3(-0.55, 0.35, 0.75))), 0.0, 1.0);
vTwinkle *= mix(1.0, shade, uEarth);
}
vec4 mv = modelViewMatrix * vec4(pos, 1.0);
gl_PointSize = uSize * aScale * uPixelRatio * (12.0 / -mv.z);
gl_Position = projectionMatrix * mv;
}`;
const FRAG = /* glsl */`
precision mediump float;
uniform float uOpacity;
varying vec3 vColor;
varying float vTwinkle;
void main(){
float d = length(gl_PointCoord - 0.5);
float alpha = smoothstep(0.5, 0.12, d);
alpha += smoothstep(0.12, 0.0, d) * 0.5;
gl_FragColor = vec4(vColor, alpha * vTwinkle * uOpacity);
}`;
const entity = (() => {
const canvas = document.getElementById('entity');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
const pr = Math.min(devicePixelRatio, isMobile ? 1.25 : 1.75);
renderer.setPixelRatio(pr);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
const scene = new THREE.Scene();
const bgColor = new THREE.Color('#04060a');
scene.background = bgColor;
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.z = SHAPE_STYLE[0].camZ;
const geo = new THREE.BufferGeometry();
const seeds = new Float32Array(COUNT);
const scales = new Float32Array(COUNT);
for (let i = 0; i < COUNT; i++) {
seeds[i] = rand();
scales[i] = seeds[i] > 0.985 ? 2.4 : 0.5 + rand() * 0.9;
}
geo.setAttribute('position', new THREE.BufferAttribute(shapes[0].slice(), 3));
geo.setAttribute('aPosA', new THREE.BufferAttribute(shapes[0].slice(), 3));
geo.setAttribute('aPosB', new THREE.BufferAttribute(shapes[1].slice(), 3));
geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
geo.setAttribute('aTint', new THREE.BufferAttribute(earthTint, 1)); // land/sea
geo.setAttribute('aRing', new THREE.BufferAttribute(ringId, 1));    // gimbal role
const uniforms = {
uMorph: { value: 0 },
uTime: { value: 0 },
uTime2: { value: 0 },
uDrift: { value: 0 },
uHeat: { value: 0 },
uWave: { value: 0 },
uTide: { value: 0 },
uComet: { value: 0 },
uSignal: { value: 0 },
uEarth: { value: 0 },
uLand: { value: EARTH_LAND.clone() },
uHero: { value: 1 },
uCore: { value: new THREE.Color('#ff8a5b') },
uRingT: { value: 0 },
uRing0: { value: new THREE.Color('#ff4b4b') },
uRing1: { value: new THREE.Color('#7fd4ff') },
uRing2: { value: new THREE.Color('#b9f0e4') },
uTurb: { value: 0 },
uBurst: { value: 0 },
uIdle: { value: CONFIG.idleJitter },
uStormAmp: { value: CONFIG.stormAmp },
uFlowFreq: { value: CONFIG.flowFreq },
uSize: { value: CONFIG.pointSize },
uPixelRatio: { value: pr },
uOpacity: { value: 0.8 },
uMouse: { value: new THREE.Vector3(999, 999, 999) },
uMouseR: { value: CONFIG.mouse.radius },
uMouseF: { value: 0 },
uColorFrom: { value: shapeColors[0].clone() },
uColorTo: { value: shapeColors[1].clone() },
};
const mat = new THREE.ShaderMaterial({
uniforms,
vertexShader: VERT,
fragmentShader: FRAG,
transparent: true,
depthWrite: false,
blending: THREE.AdditiveBlending,
});
const points = new THREE.Points(geo, mat);
/* group carries the shared drift/rotation so lines follow the points. */
const group = new THREE.Group();
group.rotation.order = 'ZYX';
group.add(points);
scene.add(group);
/* --- constellation lines: visible only when a form is at rest --- */
let lineSeg = null, lineMat = null, lineShape = -1;
if (linePairs) {
const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position',
new THREE.BufferAttribute(new Float32Array(CONFIG.lines.max * 2 * 3), 3));
lineMat = new THREE.LineBasicMaterial({
color: shapeColors[0].clone(),
transparent: true,
opacity: 0,
blending: THREE.AdditiveBlending,
depthWrite: false,
});
lineSeg = new THREE.LineSegments(lineGeo, lineMat);
group.add(lineSeg);
}
function updateLines(s) {
const pairs = linePairs[s];
const arr = lineSeg.geometry.attributes.position.array;
for (let k = 0; k < pairs.length; k++) {
const [, i, j] = pairs[k];
arr.set(shapes[s].subarray(i * 3, i * 3 + 3), k * 6);
arr.set(shapes[s].subarray(j * 3, j * 3 + 3), k * 6 + 3);
}
lineSeg.geometry.setDrawRange(0, pairs.length * 2);
lineSeg.geometry.attributes.position.needsUpdate = true;
lineMat.color.copy(shapeColors[s]);
}
/* --- post pipeline: render → afterimage trails → bloom --- */
let composer = null, afterimage = null;
if (!isMobile && !reduced) {
composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
afterimage = new AfterimagePass(CONFIG.trailDamp.base);
composer.addPass(afterimage);
composer.addPass(new UnrealBloomPass(
new THREE.Vector2(innerWidth, innerHeight),
CONFIG.bloom.strength, CONFIG.bloom.radius, CONFIG.bloom.threshold
));
}
/* --- morph controller --- */
let segment = 0;
let shapeFloat = 0;
function bindSegment(seg) {
if (seg === segment) return;
segment = seg;
geo.attributes.aPosA.array.set(shapes[seg]);
geo.attributes.aPosB.array.set(shapes[Math.min(seg + 1, 7)]);
geo.attributes.aPosA.needsUpdate = true;
geo.attributes.aPosB.needsUpdate = true;
uniforms.uColorFrom.value.copy(shapeColors[seg]);
uniforms.uColorTo.value.copy(shapeColors[Math.min(seg + 1, 7)]);
}
function setShapeFloat(f) {
shapeFloat = Math.max(0, Math.min(7, f));
const seg = Math.min(Math.floor(shapeFloat), 6);
bindSegment(seg);
uniforms.uMorph.value = shapeFloat - seg;
}
function setBackground(hex) {
const target = new THREE.Color(hex);
gsap.to(bgColor, { r: target.r, g: target.g, b: target.b, duration: 1.1, ease: EASE });
}
/* --- click burst --- */
let bursting = false;
function burst() {
if (bursting || reduced) return;
bursting = true;
dispatchEvent(new Event('aeon:burst')); // retires the cursor hint
audio.whoosh();
const dot = document.getElementById('telemDot');
const state = document.getElementById('telemState');
dot && dot.classList.add('is-critical');
if (state) state.textContent = tr('burst', 'Form scattered');
gsap.timeline({
onComplete: () => {
bursting = false;
dot && dot.classList.remove('is-critical');
if (state) state.textContent = tr('stable', 'Channel stable');
},
})
.to(uniforms.uBurst, { value: 1, duration: 1.0, ease: 'power4.out', overwrite: 'auto' })
.to(uniforms.uBurst, { value: 0, duration: 1.7, ease: 'elastic.out(1, 0.45)' }, '>-0.1');
}
/* --- arrival pulse: a small breath of the same burst mechanic,
fired as each section settles --- */
function pulse(amp = 0.12) {
if (bursting || reduced) return;
gsap.timeline()
.to(uniforms.uBurst, { value: amp, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
.to(uniforms.uBurst, { value: 0, duration: 1.2, ease: EASE }); // soft exhale, no spring
}
/* --- orbit: the horizontal scrub turns the planet --- */
let orbit = 0;
function setOrbit(p) { orbit = p; }
/* --- charge: the statement scrub feeds the star --- */
let charge = 0;
function setCharge(p) { charge = p; }
/* --- tide: featured scroll progress drives the swell phase --- */
function setTide(p) { uniforms.uTide.value = p; }
/* --- flight: scroll carries the comet along its trajectory --- */
let flight = 0.5;
function setFlight(p) { flight = p; }
addEventListener('click', (e) => {
if (e.target.closest('a, button, .rail-item, input, [data-magnetic]')) return;
burst();
});
/* --- cursor: parallax + repulsion field --- */
let mx = 0, my = 0, tmx = 0, tmy = 0;
const ndc = new THREE.Vector2(9, 9); // offscreen until the pointer moves
const raycaster = new THREE.Raycaster();
const entityPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const mouseWorld = new THREE.Vector3();
let mouseBoost = 0, lastPX = 0, lastPY = 0, lastPT = 0;
addEventListener('pointermove', (e) => {
tmx = e.clientX / innerWidth - 0.5;
tmy = e.clientY / innerHeight - 0.5;
ndc.set(tmx * 2, -tmy * 2);
// pointer speed → temporary extra push
const now = performance.now(), dt = Math.max(now - lastPT, 8);
const d = Math.hypot(e.clientX - lastPX, e.clientY - lastPY) / dt;
mouseBoost = Math.min(mouseBoost + d * 0.35, 1.4);
lastPX = e.clientX; lastPY = e.clientY; lastPT = now;
});
document.documentElement.addEventListener('pointerleave', () => ndc.set(9, 9));
/* --- camera fly-through intro: released from inside the cloud --- */
const intro = { z: reduced ? 0 : CONFIG.intro.z, spin: reduced ? 0 : CONFIG.intro.spin };
function playIntro() {
if (reduced) return;
uniforms.uTurb.value = 0.9; // dispersed at first breath, settles naturally
gsap.to(intro, { z: 0, spin: 0, duration: CONFIG.intro.duration, ease: EASE });
}
const lerp = (a, b, t) => a + (b - a) * t;
const clock = new THREE.Clock();
let lastT = 0, time2 = 0, heroSpin = 0, helixSpin = 0, earthSpin = 0;
function frame() {
const t = clock.getElapsedTime();
const dt = Math.min(t - lastT, 0.05);
lastT = t;
uniforms.uTime.value = t;
/* hero liveliness */
const heroW = Math.max(0, 1 - shapeFloat);
uniforms.uHero.value = heroW;
uniforms.uDrift.value = lerp(uniforms.uDrift.value, heroW, 0.05);
time2 += dt * (0.5 + uniforms.uDrift.value * 1.6);
uniforms.uTime2.value = time2;
heroSpin += dt * 0.06;
if (heroW > 0.001) uniforms.uRingT.value += dt; // gimbal clock, hero only
helixSpin += dt * 0.14;
earthSpin += dt * 0.08;
const targetTurb = Math.min(scrollVelocity / 80, 1.2) * CONFIG.velocityTurb;
uniforms.uTurb.value = lerp(uniforms.uTurb.value, targetTurb, 0.06);
scrollVelocity *= 0.92;
const seg = Math.min(Math.floor(shapeFloat), 6);
const f = shapeFloat - seg;
const storm = Math.sin(f * Math.PI);
// the horizontal scrub turns the planet and dollies in at mid-traverse
const orbitW = Math.max(0, 1 - Math.abs(shapeFloat - 2));
camera.position.z = lerp(SHAPE_STYLE[seg].camZ, SHAPE_STYLE[Math.min(seg + 1, 7)].camZ, f)
+ storm * 1.3 + uniforms.uBurst.value * 1.6 + intro.z
- Math.sin(orbit * Math.PI) * orbitW * 1.6;
group.position.x = lerp(SHAPE_STYLE[seg].offX, SHAPE_STYLE[Math.min(seg + 1, 7)].offX, f);
mx = lerp(mx, tmx, 0.04);
my = lerp(my, tmy, 0.04);
const helixW = Math.max(0, 1 - Math.abs(shapeFloat - 4));
const earthW = Math.max(0, shapeFloat - 6);
group.rotation.y = mx * 0.35 + Math.sin(t * 0.07) * 0.06 + intro.spin
+ orbit * 2.2 * orbitW
+ heroSpin * heroW
+ helixSpin * helixW
+ earthSpin * earthW;
group.rotation.x = my * 0.22
+ Math.sin(t * 0.23) * 0.1 * heroW;
group.rotation.z = 0.28 * helixW;
/* the star charges with the statement */
const starW = Math.max(0, 1 - Math.abs(shapeFloat - 1));
const chargeW = charge * starW;
uniforms.uHeat.value = lerp(uniforms.uHeat.value, chargeW, 0.09);
/* the sea only rolls while the ocean form is present */
uniforms.uWave.value = Math.max(0, 1 - Math.abs(shapeFloat - 3));
/* comet: slipstream on, and the whole body glides along its flight line */
const cometW = Math.max(0, 1 - Math.abs(shapeFloat - 5));
uniforms.uComet.value = cometW;
const glide = (flight - 0.5) * 9 * cometW;
group.position.x += 0.92 * glide;
group.position.y = 0.38 * glide + Math.sin(t * 0.45) * 0.18 * cometW;
/* the transmission radiates while its section is present */
uniforms.uSignal.value = Math.max(0, 1 - Math.abs(shapeFloat - 6));
uniforms.uEarth.value = earthW;
const breath = Math.sin(t * 1.1) * 0.012 * starW * (1 + chargeW);
group.scale.setScalar(1 + chargeW * 0.07 + breath);
group.updateMatrixWorld();
/* cursor world position → entity local space for the repulsion field */
if (finePointer && ndc.x < 5) {
raycaster.setFromCamera(ndc, camera);
if (raycaster.ray.intersectPlane(entityPlane, mouseWorld)) {
group.worldToLocal(mouseWorld);
uniforms.uMouse.value.copy(mouseWorld);
}
mouseBoost *= 0.94;
uniforms.uMouseF.value = lerp(uniforms.uMouseF.value,
CONFIG.mouse.force * 0.55 + mouseBoost, 0.08);
} else {
uniforms.uMouseF.value = lerp(uniforms.uMouseF.value, 0, 0.08);
}
/* constellation lines fade in at rest, hide during morphs/bursts */
if (lineSeg) {
let restShape = -1;
if (f < 0.04) restShape = seg;
else if (f > 0.96) restShape = Math.min(seg + 1, 7);
if (restShape >= 0 && restShape !== lineShape) {
lineShape = restShape;
updateLines(restShape);
}
const show = restShape >= 0 && restShape !== 0 && restShape !== 6
&& uniforms.uBurst.value < 0.05 && intro.z > -1;
lineMat.opacity = lerp(lineMat.opacity, show ? CONFIG.lines.opacity : 0, 0.05);
}
/* motion trails: barely-there at rest, long during morphs and bursts */
if (afterimage) {
afterimage.uniforms['damp'].value = Math.min(0.92,
CONFIG.trailDamp.base
+ storm * CONFIG.trailDamp.storm
+ uniforms.uBurst.value * CONFIG.trailDamp.burst
+ uniforms.uTurb.value * 0.4);
}
composer ? composer.render() : renderer.render(scene, camera);
}
if (reduced) {
renderer.render(scene, camera);
} else {
gsap.ticker.add(frame);
}
addEventListener('resize', () => {
camera.aspect = innerWidth / innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth, innerHeight);
composer && composer.setSize(innerWidth, innerHeight);
});
const debug = () => ({
shapeFloat, segment,
morph: uniforms.uMorph.value,
turb: uniforms.uTurb.value,
burst: uniforms.uBurst.value,
mouseF: uniforms.uMouseF.value,
lineShape, lineOpacity: lineMat ? lineMat.opacity : null,
introZ: intro.z,
});
return { setShapeFloat, setBackground, burst, pulse, setOrbit, setCharge, setTide, setFlight, playIntro, debug };
})();
window.__aeon = entity; // debug handle
/* ============================================================
4) SCRAMBLE DECODE — mono/HUD type resolves left-to-right
============================================================ */
const DECODE_CHARS = '█▓▒░<>/\\|=+*#01';
function decode(el, dur = 1.0) {
if (reduced || !el) return;
// operate on the last text node so icons/dots inside survive
const node = [...el.childNodes].filter((n) => n.nodeType === 3).pop();
if (!node || !node.nodeValue.trim()) return;
const orig = node.nodeValue;
const len = orig.length;
const obj = { p: 0 };
gsap.to(obj, {
p: 1, duration: dur, ease: 'power2.out',
onUpdate: () => {
const k = Math.floor(obj.p * len);
let s = orig.slice(0, k);
for (let i = k; i < len; i++) {
s += orig[i] === ' ' ? ' ' : DECODE_CHARS[(Math.random() * DECODE_CHARS.length) | 0];
}
node.nodeValue = s;
},
});
}
function initDecode() {
if (reduced) return;
gsap.utils.toArray('.kicker, .eyebrow, .hero-sub, .epoch-when').forEach((el) => {
if (el.closest('.hero')) return; // hero copies decode with the intro
const inEpochs = !!el.closest('.epochs'); // pinned: use the pin as trigger
ScrollTrigger.create({
trigger: inEpochs ? '#worlds' : el,
start: inEpochs ? 'top 60%' : 'top 90%',
once: true,
onEnter: () => decode(el, 1.0),
});
});
}
/* ============================================================
5) SCROLL CHOREOGRAPHY
============================================================ */
const sections = gsap.utils.toArray('.section');
const railItems = gsap.utils.toArray('.rail-item');
const chronoEpoch = document.getElementById('chronoEpoch');
const chronoYear = document.getElementById('chronoYear');
/* ---- morph scrub: section N arriving = morph (N-1 → N) ---- */
function initMorphTriggers() {
if (reduced) return;
const progs = new Array(8).fill(0);
const applyShape = () => {
let f = 0;
for (let i = 1; i < 8; i++) {
if (progs[i] > 0) f = Math.max(f, i - 1 + progs[i]);
}
entity.setShapeFloat(f);
};
sections.forEach((sec) => {
const idx = parseInt(sec.dataset.shape, 10);
if (!idx) return; // hero stays shape 0
ScrollTrigger.create({
trigger: sec,
start: 'top 94%',
end: 'top 34%',
scrub: CONFIG.morphScrub,
onUpdate: (self) => { progs[idx] = self.progress; applyShape(); },
});
});
}
/* ---- per-section: scene bg + glow tint + rail + label ---- */
function initSectionStates() {
const applySection = (sec) => {
entity.setBackground(sec.dataset.bg);
gsap.to('body', { backgroundColor: sec.dataset.bg, duration: 1.1, ease: EASE });
gsap.to('html', { '--glow': sec.dataset.glow, duration: 1.1, ease: EASE });
chronoEpoch.textContent = sec.dataset.epoch;
decode(chronoEpoch, 0.6);
entity.pulse(); // the entity breathes as each section settles
audio.setEpoch(parseInt(sec.dataset.shape, 10));
audio.tick();
railItems.forEach((it) =>
it.classList.toggle('is-active', it.dataset.target === sec.id));
};
applySection(sections[0]);
sections.forEach((sec, i) => {
if (!i) return;
ScrollTrigger.create({
trigger: sec,
start: 'top 52%',
end: 'top 48%', // a thin band, not a point
onEnter: () => applySection(sec),
onLeaveBack: () => applySection(sections[i - 1]),
});
});
railItems.forEach((it) => {
it.addEventListener('click', () => {
const target = document.getElementById(it.dataset.target);
if (!target) return;
lenis ? lenis.scrollTo(target) : target.scrollIntoView();
});
});
}
/* ---- progress HUD + telemetry ---- */
function initChrono() {
const fmt = (p) => tr('form', 'Form') + ' · ' + Math.round(p * 100) + '%';
if (reduced) {
chronoYear.textContent = fmt(1);
gsap.set('#chrono, #telemetry', { opacity: 1 });
return;
}
ScrollTrigger.create({
trigger: document.body,
start: 'top top',
end: 'bottom bottom',
scrub: true,
onUpdate: (self) => {
chronoYear.textContent = fmt(self.progress);
},
});
// visible only during the walk
ScrollTrigger.create({
trigger: '#ignition',
start: 'top 75%',
onEnter: () => gsap.to('#chrono, #telemetry', { opacity: 1, duration: 0.8, ease: EASE }),
onLeaveBack: () => gsap.to('#chrono, #telemetry', { opacity: 0, duration: 0.5, ease: EASE }),
});
ScrollTrigger.create({
trigger: '.footer',
start: 'top 92%',
onEnter: () => gsap.to('#chrono, #telemetry', { opacity: 0, duration: 0.5, ease: EASE }),
onLeaveBack: () => gsap.to('#chrono, #telemetry', { opacity: 1, duration: 0.5, ease: EASE }),
});
// live mouse-coordinate readout
const coords = document.getElementById('telemCoords');
if (coords && finePointer) {
addEventListener('pointermove', (e) => {
coords.textContent =
(e.clientX / innerWidth).toFixed(2) + ' · ' + (e.clientY / innerHeight).toFixed(2);
});
}
}
/* ---- SplitText reveals ---- */
let heroSplit;
function prepHero() {
heroSplit = new SplitText('#heroTitle', { type: 'chars' });
if (!reduced) {
gsap.set(heroSplit.chars, { yPercent: 115, opacity: 0 });
gsap.set('#heroSub', { opacity: 0, y: 18 });
}
}
function startHeroReveal() {
if (reduced) return;
gsap.timeline()
.to(heroSplit.chars, {
yPercent: 0, opacity: 1, duration: 1.6, ease: EASE,
stagger: { each: 0.07, from: 'center' },
})
.to('#heroSub', { opacity: 1, y: 0, duration: 1.2, ease: EASE }, '-=1.0')
.call(() => {
decode(document.querySelector('.hero .eyebrow'), 1.2);
decode(document.getElementById('heroSub'), 1.4);
}, null, '<');
}
function initSplitHeadings() {
if (reduced) return;
gsap.utils.toArray('.split').forEach((el) => {
const split = new SplitText(el, { type: 'lines', mask: 'lines' });
gsap.set(split.lines, { yPercent: 112 });
ScrollTrigger.create({
trigger: el,
start: 'top 82%',
once: true,
onEnter: () => gsap.to(split.lines, {
yPercent: 0, duration: CONFIG.revealDur, ease: EASE, stagger: 0.09,
}),
});
});
}
function initReveals() {
if (reduced) return;
ScrollTrigger.batch('[data-reveal]', {
start: 'top 96%',
once: true,
onEnter: (els) => gsap.to(els, {
y: 0, opacity: 1, duration: CONFIG.revealDur, ease: EASE, stagger: 0.09, overwrite: true,
}),
});
}
/* ---- image clip reveals + gentle parallax ---- */
function initImages() {
if (reduced) return;
gsap.utils.toArray('figure[data-img-reveal]').forEach((fig) => {
const img = fig.querySelector('img');
const inEpochs = !!fig.closest('.epochs');
ScrollTrigger.create({
trigger: inEpochs ? '#worlds' : fig,
start: inEpochs ? 'top 60%' : 'top 85%',
once: true,
onEnter: () => {
gsap.to(fig, { clipPath: 'inset(0% 0 0% 0)', duration: 1.5, ease: EASE });
gsap.to(img, { scale: 1, duration: 1.9, ease: EASE });
},
});
});
gsap.utils.toArray('[data-speed]').forEach((el) => {
const speed = parseFloat(el.dataset.speed);
gsap.to(el, {
yPercent: (1 - speed) * 26, ease: 'none',
scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
});
});
// featured: the photo pans top-to-bottom inside its frame
const featImg = document.querySelector('.featured-img img');
if (featImg) {
gsap.fromTo(featImg, { yPercent: 0 }, {
yPercent: -12, ease: 'none',
scrollTrigger: { trigger: '#water', start: 'top bottom', end: 'bottom top', scrub: true },
});
}
}
/* ---- pinned statement: lines ignite one by one ---- */
function initStatement() {
if (reduced) return;
const lines = gsap.utils.toArray('#statementLines .s-line');
gsap.set(lines, { opacity: 0.14, y: 24 });
gsap.timeline({
scrollTrigger: {
trigger: '#ignition',
start: 'top top',
end: '+=130%',
pin: true,
scrub: 0.6,
onUpdate: (self) => entity.setCharge(self.progress),
},
}).to(lines, {
opacity: 1, y: 0, color: '#eef2f7', stagger: 0.45, ease: 'none',
});
}
/* ---- manifesto: lines ignite one by one, scrubbed by scroll ---- */
function initManifesto() {
if (reduced) return;
const lines = gsap.utils.toArray('#manifestoLines .m-line');
gsap.set(lines, { opacity: 0.1, y: 26 });
gsap.to(lines, {
opacity: 1, y: 0, stagger: 0.5, ease: 'none',
scrollTrigger: {
trigger: '#manifestoLines',
start: 'top 82%',
end: 'center 42%',
scrub: 0.6,
},
});
}
/* ---- featured: scrolling drives the tide through the basin ---- */
function initTide() {
if (reduced) return;
ScrollTrigger.create({
trigger: '#water',
start: 'top bottom',
end: 'bottom top',
scrub: true,
onUpdate: (self) => entity.setTide(self.progress),
});
}
/* ---- program: scrolling flies the comet across the sky ---- */
function initFlight() {
if (reduced) return;
ScrollTrigger.create({
trigger: '#flight',
start: 'top bottom',
end: 'bottom top',
scrub: true,
onUpdate: (self) => entity.setFlight(self.progress),
});
}
/* ---- pinned horizontal cards ---- */
function initEpochs() {
const track = document.getElementById('epochsTrack');
const bar = document.getElementById('epochsBar');
if (reduced) { track.style.overflowX = 'auto'; return; }
const dist = () => track.scrollWidth - innerWidth + 80;
gsap.to(track, {
x: () => -dist(),
ease: 'none',
scrollTrigger: {
trigger: '#worlds',
start: 'top top',
end: () => '+=' + (dist() + innerHeight * 0.4),
pin: true,
scrub: 0.6,
invalidateOnRefresh: true,
onUpdate: (self) => {
bar.style.width = (self.progress * 100) + '%';
entity.setOrbit(self.progress); // the planet turns as cards pass
},
},
});
}
/* ---- preloader: 0 → 100%, then the fly-through ---- */
function runPreloader() {
const num = document.getElementById('preNum');
const bar = document.getElementById('preBar');
const loader = document.getElementById('preloader');
if (reduced) { loader.remove(); return; }
const obj = { n: 0 };
gsap.to(obj, {
n: 100, duration: 2.2, ease: 'power1.inOut',
onUpdate: () => {
num.textContent = Math.round(obj.n).toString().padStart(2, '0');
bar.style.width = obj.n + '%';
},
onComplete: () => gsap.to(loader, {
autoAlpha: 0, duration: 1.0, ease: EASE,
onComplete: () => {
loader.remove();
lenis && lenis.start();
entity.playIntro(); // camera pulls back out of the cloud…
startHeroReveal();  // …while the title rises through it
},
}),
});
}
/* ---- cursor + magnetic buttons ---- */
function initCursor() {
if (reduced || !finePointer) return;
const core = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
const hint = document.getElementById('cursorHint');
let cx = innerWidth / 2, cy = innerHeight / 2, dx = cx, dy = cy;
let lastMove = -1e9, lastTick = performance.now();
let overInteractive = false, hintRetired = false, pointerOn = false;
const place = (el, x, y) => { el.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
// once the visitor bursts the entity themselves, the lesson is learned
addEventListener('aeon:burst', () => {
hintRetired = true;
hint && hint.classList.remove('is-on');
}, { once: true });
addEventListener('pointermove', (e) => {
cx = e.clientX; cy = e.clientY;
overInteractive = !!e.target.closest('a, button, [data-magnetic], .rail-item, input');
// re-entry from outside the window: snap the ring instead of sweeping across
if (!pointerOn) { dx = cx; dy = cy; place(ring, dx, dy); }
pointerOn = true;
lastMove = performance.now();
core.classList.add('is-on');
// the core is the aiming point: exact position, no smoothing
place(core, cx, cy);
if (hint) place(hint, cx + 18, cy + 22);
});
document.documentElement.addEventListener('pointerleave', () => {
pointerOn = false;
core.classList.remove('is-on');
ring.classList.remove('is-trail', 'is-hover');
hint && hint.classList.remove('is-on');
});
gsap.ticker.add(() => {
const now = performance.now();
const dt = Math.min(now - lastTick, 50);
lastTick = now;
// time-based easing: the trail feels the same at 30, 60 or 144 fps
const k = 1 - Math.exp(-dt / 120);
dx += (cx - dx) * k;
dy += (cy - dy) * k;
place(ring, dx, dy);
const moving = pointerOn && now - lastMove < 120;
ring.classList.toggle('is-trail', moving && !overInteractive);
if (hint) hint.classList.toggle('is-on', pointerOn && !hintRetired && !overInteractive);
});
document.querySelectorAll('a, button, .rail-item').forEach((el) => {
el.addEventListener('pointerenter', () => {
ring.classList.add('is-hover');
core.classList.add('is-hover');
});
el.addEventListener('pointerleave', () => {
ring.classList.remove('is-hover');
core.classList.remove('is-hover');
});
});
}
function initMagnetic() {
if (reduced || !finePointer) return;
document.querySelectorAll('[data-magnetic]').forEach((btn) => {
btn.addEventListener('pointermove', (e) => {
const r = btn.getBoundingClientRect();
const rawX = (e.clientX - (r.left + r.width / 2)) * 0.35;
const rawY = (e.clientY - (r.top + r.height / 2)) * 0.35;
// cap the pull so the target does not dodge the pointer
const len = Math.hypot(rawX, rawY);
const k = len > 10 ? 10 / len : 1;
gsap.to(btn, { x: rawX * k, y: rawY * k, duration: 0.45, ease: EASE });
});
btn.addEventListener('pointerleave', () =>
gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }));
});
}

/* ============================================================
6) PAGE LAYER — install copy + mobile menu
============================================================ */
function initCopy() {
document.querySelectorAll('[data-copy]').forEach((btn) => {
const label = btn.dataset.labelCopy || 'Copy';
const copied = btn.dataset.labelCopied || 'Copied';
let timer = 0;
btn.addEventListener('click', async () => {
try {
await navigator.clipboard.writeText(btn.dataset.copy);
} catch {
return;
}
btn.classList.add('is-copied');
btn.textContent = copied;
clearTimeout(timer);
timer = setTimeout(() => {
btn.classList.remove('is-copied');
btn.textContent = label;
}, 1600);
});
});
}
function initMenu() {
const btn = document.getElementById('navBurger');
const menu = document.getElementById('navMenu');
if (!btn || !menu) return;
const setOpen = (open) => {
btn.classList.toggle('is-open', open);
menu.classList.toggle('is-open', open);
btn.setAttribute('aria-expanded', String(open));
document.body.classList.toggle('menu-open', open);
if (lenis) open ? lenis.stop() : lenis.start();
};
btn.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
addEventListener('keydown', (e) => {
if (e.key === 'Escape') setOpen(false);
});
addEventListener('resize', () => {
if (innerWidth > 900) setOpen(false);
});
}

/* ============================================================
BOOT — pins first (they change layout), then everything else
============================================================ */
function init() {
prepHero();
initStatement();
initEpochs();
initTide();
initFlight();
initManifesto();
initMorphTriggers();
initSectionStates();
initChrono();
initSplitHeadings();
initReveals();
initImages();
initDecode();
initCursor();
initMagnetic();
initSoundToggle();
initCopy();
initMenu();
runPreloader();
ScrollTrigger.refresh();
}
/* wait for both window load AND fonts, so SplitText measures real glyphs */
const winLoaded = new Promise((res) => {
if (document.readyState === 'complete') res();
else addEventListener('load', res, { once: true });
});
const fontsLoaded = (document.fonts && document.fonts.ready) || Promise.resolve();
Promise.all([winLoaded, fontsLoaded]).then(init);
