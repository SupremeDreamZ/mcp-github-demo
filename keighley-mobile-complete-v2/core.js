'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const lerp = (a, b, amount) => a + (b - a) * amount;
const ease = (value) => value * value * (3 - 2 * value);

const canvas = $('#scene');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
const stage = $('#stage');
const statusCopy = $('#status-copy');
const sections = $$('.section');
const anatomyUI = $('#anatomy-ui');
const operatorUI = $('#operator-ui');
const progressBar = $('#progress i');
const focusInput = $('#focus');
const tiltInput = $('#tilt');
const focusOutput = $('#focus-out');
const tiltOutput = $('#tilt-out');

let width = 390;
let height = 844;
let dpr = 1;
let activeSection = 0;
let sectionProgress = 0;
let selectedPart = 'body';
let frameMode = 'imax';
let rolling = false;
let pan = 0;
let targetPan = 0;
let pointerDown = false;
let pointerX = 0;
let lastFrame = 0;
let elapsed = 0;
let audioContext = null;
let transportGain = null;
let transportTimer = 42;

const descriptions = {
  body: 'Carbon-fiber center body, machined frame, recessed hardware, and the horizontal film gate.',
  lens: 'Large-format lens barrel with geared focus and iris rings, front glass, and a compact matte box.',
  magazine: 'Side film magazine carrying the 65mm load and feeding the horizontal fifteen-perforation transport.',
  lcd: 'Local telemetry for frame rate, remaining film, voltage, current, temperature, and transport state.',
  finder: 'Reflex finder and video-tap assembly mounted above the main chassis.'
};

function resize() {
  width = Math.max(1, innerWidth);
  height = Math.max(1, innerHeight);
  dpr = Math.min(devicePixelRatio || 1, width <= 760 ? 1.35 : 1.75);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function roundedRect(context, x, y, w, h, radius) {
  const r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function fillGradientRect(x, y, w, h, radius, stops, vertical = false) {
  const gradient = vertical ? ctx.createLinearGradient(x, y, x, y + h) : ctx.createLinearGradient(x, y, x + w, y);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  roundedRect(ctx, x, y, w, h, radius);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function strokeRounded(x, y, w, h, radius, color, lineWidth = 1) {
  roundedRect(ctx, x, y, w, h, radius);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function carbonPattern(alpha = 0.14) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#aeb5ba';
  ctx.lineWidth = 1;
  for (let i = -80; i < 320; i += 9) {
    ctx.beginPath(); ctx.moveTo(i, -120); ctx.lineTo(i + 240, 120); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(i, 120); ctx.lineTo(i + 240, -120); ctx.stroke();
  }
  ctx.restore();
}

function partGlow(name, x, y, w, h, radius = 12) {
  if (activeSection !== 2 || selectedPart !== name) return;
  ctx.save();
  ctx.shadowColor = '#e8a33d';
  ctx.shadowBlur = 26;
  ctx.strokeStyle = 'rgba(255,191,91,.95)';
  ctx.lineWidth = 2.5;
  roundedRect(ctx, x - 4, y - 4, w + 8, h + 8, radius + 4);
  ctx.stroke();
  ctx.restore();
}

function cameraLayout() {
  const portrait = height >= width;
  const baseScale = Math.min(width / 820, height / 620) * (portrait ? 1.28 : 1.03);
  let scale = baseScale;
  let cx = width * 0.52;
  let cy = height * (portrait ? 0.43 : 0.52);
  let rotation = -0.035;

  const layouts = [
    [0.90, 0.51, portrait ? 0.285 : 0.46, -0.04],
    [0.92, 0.53, portrait ? 0.39 : 0.50, 0.035],
    [0.66, 0.50, portrait ? 0.61 : 0.52, -0.02],
    [0.76, 0.51, portrait ? 0.43 : 0.52, 0.01],
    [0.74, 0.49, portrait ? 0.45 : 0.54, -0.045],
    [0.67, 0.55, portrait ? 0.46 : 0.52, 0.08],
    [0.0, 0.50, 0.50, 0],
    [0.72, 0.52, portrait ? 0.43 : 0.52, -0.03]
  ][activeSection];

  scale *= layouts[0];
  cx = width * layouts[1];
  cy = height * layouts[2];
  rotation = layouts[3];
  return { scale, cx, cy, rotation };
}
