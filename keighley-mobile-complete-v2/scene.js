function drawOdysseyScene() {
  const focus = Number(focusInput.value) / 100;
  const tilt = Number(tiltInput.value) / 100;
  pan += (targetPan - pan) * .14;
  const horizon = height * (.49 + tilt * .15);
  const shipX = width * .56 + pan * width * .27;
  const shipY = horizon + height * .04;

  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, '#07101d'); sky.addColorStop(.52, '#243c55'); sky.addColorStop(1, '#d18a51'); ctx.fillStyle = sky; ctx.fillRect(0, 0, width, horizon);
  const sea = ctx.createLinearGradient(0, horizon, 0, height);
  sea.addColorStop(0, '#315c70'); sea.addColorStop(.3, '#123140'); sea.addColorStop(1, '#031015'); ctx.fillStyle = sea; ctx.fillRect(0, horizon, width, height - horizon);

  const moonGlow = ctx.createRadialGradient(width * .18, height * .16, 3, width * .18, height * .16, 52);
  moonGlow.addColorStop(0, 'rgba(255,239,196,.95)'); moonGlow.addColorStop(.18, 'rgba(255,222,163,.62)'); moonGlow.addColorStop(1, 'rgba(255,210,145,0)');
  ctx.fillStyle = moonGlow; ctx.beginPath(); ctx.arc(width * .18, height * .16, 52, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffe8b8'; ctx.beginPath(); ctx.arc(width * .18, height * .16, 13, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.filter = `blur(${Math.max(0, (focus - .55) * 10)}px)`;
  drawShip(shipX, shipY, Math.min(width / 440, height / 560) * 1.12);
  ctx.restore();

  ctx.save();
  ctx.filter = `blur(${Math.max(0, (.48 - focus) * 12)}px)`;
  drawForegroundWaves(horizon);
  ctx.restore();

  drawViewfinderHUD(focus);
}

function drawShip(x, y, scale) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = '#4a2e1b'; ctx.beginPath(); ctx.moveTo(-170, 32); ctx.lineTo(150, 32); ctx.lineTo(112, 82); ctx.lineTo(-128, 82); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a96b39'; ctx.fillRect(-135, 20, 245, 18);
  ctx.fillStyle = '#694026'; ctx.beginPath(); ctx.moveTo(-170, 32); ctx.lineTo(-215, 54); ctx.lineTo(-128, 82); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#65452c'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-15, 22); ctx.lineTo(-15, -175); ctx.stroke();
  const sail = ctx.createLinearGradient(-15, -155, 90, 0); sail.addColorStop(0, '#e0d2aa'); sail.addColorStop(.6, '#b9a77d'); sail.addColorStop(1, '#74664b'); ctx.fillStyle = sail; ctx.beginPath(); ctx.moveTo(-8, -160); ctx.lineTo(100, -15); ctx.lineTo(-8, -15); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,230,190,.45)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = '#765034'; ctx.lineWidth = 5;
  for (let i = 0; i < 7; i++) { const ox = -105 + i * 36; ctx.beginPath(); ctx.moveTo(ox, 58); ctx.lineTo(ox + (i % 2 ? 54 : -54), 112); ctx.stroke(); }
  ctx.restore();
}

function drawForegroundWaves(horizon) {
  ctx.save();
  for (let row = 0; row < 8; row++) {
    const y = lerp(horizon + 40, height + 20, row / 7);
    const amplitude = 5 + row * 2;
    ctx.beginPath();
    for (let x = -20; x <= width + 20; x += 8) {
      const waveY = y + Math.sin(x * .034 + elapsed * (1.8 + row * .08) + row) * amplitude;
      if (x === -20) ctx.moveTo(x, waveY); else ctx.lineTo(x, waveY);
    }
    ctx.strokeStyle = `rgba(${90 + row * 8},${145 + row * 6},${175 + row * 4},${.38 + row * .045})`;
    ctx.lineWidth = 1.2 + row * .35; ctx.stroke();
  }
  ctx.restore();
}

function drawViewfinderHUD(focus) {
  const insetX = width * .075, insetY = height * .12;
  ctx.save();
  ctx.strokeStyle = 'rgba(244,241,234,.62)'; ctx.lineWidth = 1; ctx.strokeRect(insetX, insetY, width - insetX * 2, height - insetY * 2);
  ctx.strokeStyle = 'rgba(232,163,61,.85)'; ctx.beginPath(); ctx.arc(width / 2, height / 2, 18, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(width / 2 - 34, height / 2); ctx.lineTo(width / 2 - 12, height / 2); ctx.moveTo(width / 2 + 12, height / 2); ctx.lineTo(width / 2 + 34, height / 2); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(insetX, insetY - 28, 178, 22);
  ctx.fillStyle = rolling ? '#ff695e' : '#e8a33d'; ctx.font = '700 10px monospace'; ctx.textAlign = 'left'; ctx.fillText(rolling ? '● REC  24.000' : 'STBY  24.000', insetX + 8, insetY - 13);
  ctx.fillStyle = '#f2efe7'; ctx.textAlign = 'right'; ctx.fillText(focus < .38 ? 'FOCUS: WATER' : focus < .68 ? 'FOCUS: MIDSHIP' : 'FOCUS: SHIP', width - insetX, insetY - 13);
  ctx.restore();
}

function drawLegacy() {
  ctx.save();
  const gradient = ctx.createLinearGradient(0, height * .55, 0, height);
  gradient.addColorStop(0, 'rgba(0,0,0,0)'); gradient.addColorStop(1, 'rgba(0,0,0,.8)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = .5; ctx.strokeStyle = '#e8a33d'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(width * .15, height * .72); ctx.lineTo(width * .85, height * .72); ctx.stroke();
  ctx.restore();
}

function updateSectionState() {
  const marker = height * .46;
  let best = 0;
  let bestDistance = Infinity;
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs((rect.top + rect.bottom) / 2 - marker);
    if (distance < bestDistance) { bestDistance = distance; best = index; }
  });
  activeSection = best;
  document.body.dataset.section = String(best);
  sections.forEach((section, index) => section.classList.toggle('active', index === best));
  anatomyUI.classList.toggle('show', best === 2);
  operatorUI.classList.toggle('show', best === 6);
  if (best !== 6) { pointerDown = false; stage.style.touchAction = 'pan-y'; }
  const section = sections[best];
  const rect = section.getBoundingClientRect();
  sectionProgress = clamp((marker - rect.top) / Math.max(1, rect.height));
  const max = document.documentElement.scrollHeight - height;
  progressBar.style.height = `${max > 0 ? clamp(scrollY / max) * 100 : 0}%`;
}

function setupAudio() {
  if (audioContext) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  audioContext = new AudioCtor();
  const source = audioContext.createOscillator();
  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * .55;
  const noise = audioContext.createBufferSource(); noise.buffer = noiseBuffer; noise.loop = true;
  const filter = audioContext.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 950; filter.Q.value = .7;
  const gain = audioContext.createGain(); gain.gain.value = 0; transportGain = gain;
  source.type = 'square'; source.frequency.value = 48;
  const oscGain = audioContext.createGain(); oscGain.gain.value = .012;
  noise.connect(filter).connect(gain).connect(audioContext.destination);
  source.connect(oscGain).connect(gain);
  noise.start(); source.start();
}

function setRolling(value) {
  rolling = value;
  document.body.classList.toggle('recording', value);
  operatorUI.classList.toggle('recording', value);
  $('#roll').textContent = value ? 'Stop camera' : 'Roll camera';
  statusCopy.textContent = value ? 'Film transport · rolling' : 'Canvas renderer · ready';
  setupAudio();
  if (audioContext?.state === 'suspended') audioContext.resume();
  if (transportGain && audioContext) transportGain.gain.setTargetAtTime(value ? .045 : 0, audioContext.currentTime, .06);
}

function updateOutputs() {
  const focus = Number(focusInput.value);
  focusOutput.textContent = focus < 38 ? 'Water' : focus < 68 ? 'Midship' : 'Ship';
  const tilt = Number(tiltInput.value);
  tiltOutput.textContent = tilt > 18 ? 'Up' : tilt < -18 ? 'Down' : 'Level';
}
