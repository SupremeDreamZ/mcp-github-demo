function drawLens(offsetX, offsetY, selected = false) {
  const x = -330 + offsetX, y = -76 + offsetY;
  partGlow('lens', x, y, 240, 152, 25);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 12;
  fillGradientRect(x + 28, y + 9, 195, 134, 26, [[0, '#24282b'], [.28, '#62696e'], [.52, '#202427'], [1, '#08090a']]);
  ctx.shadowColor = 'transparent';
  for (const [dx, w] of [[50, 20], [92, 24], [140, 18]]) {
    fillGradientRect(x + dx, y, w, 152, 9, [[0, '#111214'], [.5, '#5f666a'], [1, '#101112']], true);
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1;
    for (let i = 5; i < w; i += 5) { ctx.beginPath(); ctx.moveTo(x + dx + i, y + 5); ctx.lineTo(x + dx + i, y + 147); ctx.stroke(); }
  }
  fillGradientRect(x, y - 12, 34, 176, 6, [[0, '#4b5053'], [.5, '#111315'], [1, '#5b6164']], true);
  ctx.fillStyle = '#030303'; ctx.fillRect(x - 20, y - 27, 22, 206);
  ctx.beginPath(); ctx.ellipse(x + 220, y + 76, 18, 62, 0, 0, Math.PI * 2); ctx.fillStyle = '#030303'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 32, y + 76, 27, 58, 0, 0, Math.PI * 2);
  const glass = ctx.createRadialGradient(x + 25, y + 62, 2, x + 32, y + 76, 62);
  glass.addColorStop(0, '#c6e2ff'); glass.addColorStop(.13, '#53719a'); glass.addColorStop(.47, '#142942'); glass.addColorStop(.8, '#04070c'); glass.addColorStop(1, '#000'); ctx.fillStyle = glass; ctx.fill();
  ctx.strokeStyle = 'rgba(170,211,255,.5)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}

function drawBody(offsetX, offsetY) {
  const x = -100 + offsetX, y = -100 + offsetY, w = 310, h = 205;
  partGlow('body', x, y, w, h, 20);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 16;
  fillGradientRect(x, y, w, h, 18, [[0, '#9aa1a5'], [.12, '#3c4246'], [.5, '#252a2d'], [.86, '#101214'], [1, '#62696d']]);
  ctx.save(); roundedRect(ctx, x + 10, y + 12, w - 20, h - 24, 13); ctx.clip(); ctx.translate(x, y); carbonPattern(.12); ctx.restore();
  ctx.shadowColor = 'transparent';
  fillGradientRect(x - 7, y - 8, w + 14, 15, 5, [[0, '#8f9598'], [.3, '#2e3336'], [.75, '#a6aaac'], [1, '#282c2e']]);
  fillGradientRect(x - 7, y + h - 7, w + 14, 15, 5, [[0, '#303437'], [.5, '#909597'], [1, '#202426']]);
  fillGradientRect(x - 4, y + 22, 12, h - 44, 4, [[0, '#a7abad'], [.5, '#34383a'], [1, '#7a7e80']], true);
  fillGradientRect(x + w - 8, y + 22, 12, h - 44, 4, [[0, '#8f9496'], [.5, '#24282a'], [1, '#696e70']], true);
  strokeRounded(x + 20, y + 25, w - 40, h - 50, 12, 'rgba(255,255,255,.12)', 1);
  fillGradientRect(x + 83, y + 118, 152, 53, 7, [[0, '#050606'], [.5, '#1e2123'], [1, '#030404']]);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 21px Arial'; ctx.textAlign = 'center'; ctx.fillText('IMAX', x + 159, y + 64);
  ctx.fillStyle = '#888d8f'; ctx.font = '700 8px monospace'; ctx.letterSpacing = '2px'; ctx.fillText('15 / 70 CAMERA SYSTEM', x + 159, y + 83);
  for (const sx of [22, w - 22]) for (const sy of [22, h - 22]) {
    ctx.beginPath(); ctx.arc(x + sx, y + sy, 5.5, 0, Math.PI * 2); ctx.fillStyle = '#0a0b0c'; ctx.fill(); ctx.strokeStyle = '#777'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + sx - 3, y + sy + 2); ctx.lineTo(x + sx + 3, y + sy - 2); ctx.strokeStyle = '#9a9a9a'; ctx.stroke();
  }
  ctx.restore();
}

function drawMagazine(offsetX, offsetY) {
  const x = 205 + offsetX, y = -82 + offsetY, w = 170, h = 182;
  partGlow('magazine', x, y, w, h, 22);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 12;
  fillGradientRect(x, y, w, h, 22, [[0, '#8c9498'], [.14, '#3c4245'], [.56, '#1f2427'], [1, '#0b0d0e']]);
  ctx.save(); roundedRect(ctx, x + 8, y + 9, w - 16, h - 18, 16); ctx.clip(); ctx.translate(x, y); carbonPattern(.1); ctx.restore();
  ctx.shadowColor = 'transparent';
  strokeRounded(x + 10, y + 12, w - 20, h - 24, 14, 'rgba(255,255,255,.12)', 1);
  for (const cy of [y + 54, y + 128]) {
    ctx.beginPath(); ctx.arc(x + 91, cy, 42, 0, Math.PI * 2); const reel = ctx.createRadialGradient(x + 82, cy - 9, 3, x + 91, cy, 42); reel.addColorStop(0, '#aaaeb0'); reel.addColorStop(.35, '#44494b'); reel.addColorStop(.7, '#171a1c'); reel.addColorStop(1, '#777c7e'); ctx.fillStyle = reel; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 91, cy, 12, 0, Math.PI * 2); ctx.fillStyle = '#070808'; ctx.fill();
  }
  fillGradientRect(x - 12, y + 63, 22, 58, 5, [[0, '#7f8486'], [.5, '#202426'], [1, '#555a5c']], true);
  ctx.restore();
}

function drawLCD(offsetX, offsetY) {
  const x = 1 + offsetX, y = 28 + offsetY, w = 156, h = 76;
  partGlow('lcd', x, y, w, h, 8);
  fillGradientRect(x, y, w, h, 8, [[0, '#080909'], [.5, '#242728'], [1, '#050505']]);
  fillGradientRect(x + 12, y + 11, w - 24, h - 22, 4, [[0, '#09150f'], [.4, '#103e25'], [1, '#031008']]);
  ctx.fillStyle = '#8bffad'; ctx.font = '700 9px monospace'; ctx.textAlign = 'left';
  ctx.fillText(rolling ? 'REC  24.000' : 'STBY 24.000', x + 19, y + 29);
  ctx.fillText(`REM 00:${String(Math.max(0, Math.floor(transportTimer))).padStart(2, '0')}`, x + 19, y + 47);
  ctx.fillStyle = '#4cc77a'; ctx.fillRect(x + 18, y + 57, (w - 38) * clamp(transportTimer / 42), 4);
}

function drawFinder(offsetX, offsetY) {
  const x = 18 + offsetX, y = -166 + offsetY, w = 150, h = 52;
  partGlow('finder', x, y, w, h, 9);
  fillGradientRect(x, y, w, h, 9, [[0, '#25292b'], [.45, '#080909'], [1, '#393d3f']]);
  fillGradientRect(x + w - 10, y + 9, 56, 34, 16, [[0, '#0a0a0a'], [.5, '#35383a'], [1, '#050505']]);
  ctx.beginPath(); ctx.arc(x - 4, y + 26, 17, 0, Math.PI * 2); ctx.fillStyle = '#050606'; ctx.fill();
  ctx.beginPath(); ctx.arc(x - 5, y + 26, 10, 0, Math.PI * 2); ctx.fillStyle = '#41688d'; ctx.fill();
  fillGradientRect(x + 35, y + h, 10, 59, 4, [[0, '#74797b'], [.5, '#232728'], [1, '#858a8c']], true);
}

function drawRods() {
  ctx.save();
  ctx.strokeStyle = '#707577'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (const y of [130, 151]) { ctx.beginPath(); ctx.moveTo(-270, y); ctx.lineTo(335, y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1;
  for (const y of [127, 148]) { ctx.beginPath(); ctx.moveTo(-270, y); ctx.lineTo(335, y); ctx.stroke(); }
  ctx.restore();
}

function explodeOffsets() {
  if (activeSection !== 2) return { body: [0, 0], lens: [0, 0], magazine: [0, 0], lcd: [0, 0], finder: [0, 0] };
  const amount = 1;
  return {
    body: [0, 12 * amount],
    lens: [-88 * amount, 12 * amount],
    magazine: [72 * amount, -12 * amount],
    lcd: [0, 78 * amount],
    finder: [12 * amount, -72 * amount]
  };
}

function drawCameraSpotlight() {
  const layout = cameraLayout();
  const glow = ctx.createRadialGradient(layout.cx, layout.cy - 18, 8, layout.cx, layout.cy, Math.max(width, height) * .43);
  glow.addColorStop(0, 'rgba(255,235,205,.28)');
  glow.addColorStop(.32, 'rgba(146,164,178,.16)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
  ctx.save(); ctx.globalAlpha = .46; ctx.filter = 'blur(13px)'; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(layout.cx, layout.cy + 125 * layout.scale, 330 * layout.scale, 38 * layout.scale, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}

function drawCamera() {
  const layout = cameraLayout();
  const offsets = explodeOffsets();
  ctx.save();
  ctx.translate(layout.cx, layout.cy);
  ctx.rotate(layout.rotation);
  ctx.scale(layout.scale, layout.scale);
  drawRods();
  drawBody(...offsets.body);
  drawLens(...offsets.lens);
  drawMagazine(...offsets.magazine);
  drawLCD(...offsets.lcd);
  drawFinder(...offsets.finder);
  if (activeSection === 1) drawFilmTransport();
  if (activeSection === 3) drawBlimp();
  if (activeSection === 4) drawPeriscope();
  ctx.restore();
}

function drawFilmTransport() {
  ctx.save();
  ctx.translate(-60, -6);
  const speed = (elapsed * 120) % 34;
  ctx.strokeStyle = 'rgba(232,163,61,.85)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(-90, -8); ctx.bezierCurveTo(-20, -58, 75, -58, 142, -3); ctx.stroke();
  ctx.strokeStyle = '#190e08'; ctx.lineWidth = 2;
  for (let x = -80 - speed; x < 140; x += 18) { ctx.beginPath(); ctx.moveTo(x, -37); ctx.lineTo(x + 7, -29); ctx.stroke(); }
  ctx.restore();
}

function drawBlimp() {
  ctx.save();
  ctx.strokeStyle = 'rgba(190,194,195,.85)'; ctx.lineWidth = 16; ctx.lineJoin = 'round';
  roundedRect(ctx, -405, -208, 790, 390, 30); ctx.stroke();
  ctx.strokeStyle = '#17191a'; ctx.lineWidth = 12; roundedRect(ctx, -405, -208, 790, 390, 30); ctx.stroke();
  fillGradientRect(-395, -200, 785, 30, 9, [[0, '#35393b'], [.5, '#111313'], [1, '#2f3335']]);
  fillGradientRect(-395, 148, 785, 30, 9, [[0, '#2d3133'], [.5, '#090a0a'], [1, '#3b3f41']]);
  fillGradientRect(350, -174, 36, 322, 9, [[0, '#3a3e40'], [.5, '#0b0c0c'], [1, '#303436']], true);
  ctx.fillStyle = '#111'; ctx.font = '700 15px monospace'; ctx.textAlign = 'center'; ctx.fillText('SOUND BLIMP · ACCESS OPEN', 0, -180);
  ctx.restore();
}

function drawPeriscope() {
  ctx.save();
  fillGradientRect(-10, -275, 55, 145, 8, [[0, '#404446'], [.5, '#090a0a'], [1, '#2c3032']], true);
  fillGradientRect(-12, -292, 205, 55, 10, [[0, '#262a2c'], [.5, '#070808'], [1, '#3e4244']]);
  ctx.beginPath(); ctx.moveTo(134, -284); ctx.lineTo(185, -268); ctx.lineTo(168, -237); ctx.lineTo(119, -253); ctx.closePath();
  const mirror = ctx.createLinearGradient(120, -280, 185, -240); mirror.addColorStop(0, '#d9edff'); mirror.addColorStop(.35, '#6a8dad'); mirror.addColorStop(1, '#13202c'); ctx.fillStyle = mirror; ctx.fill();
  ctx.strokeStyle = 'rgba(232,163,61,.9)'; ctx.lineWidth = 2; ctx.setLineDash([7, 7]); ctx.beginPath(); ctx.moveTo(155, -261); ctx.lineTo(12, -148); ctx.lineTo(-115, -25); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}

function drawScaleSection() {
  const cx = width * .48, cy = height * .48;
  ctx.save();
  ctx.globalAlpha = .22;
  ctx.strokeStyle = '#e8a33d'; ctx.lineWidth = 2;
  for (let r = 80; r < Math.max(width, height) * .75; r += 58) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }
  ctx.globalAlpha = .55;
  ctx.font = '700 10px monospace'; ctx.fillStyle = '#e8a33d'; ctx.textAlign = 'center';
  const labels = ['24 FPS', '334 FT/MIN', '15 PERF', '65 MM'];
  labels.forEach((label, index) => { const angle = elapsed * .05 + index * Math.PI / 2; const r = 115 + index * 38; ctx.fillText(label, cx + Math.cos(angle) * r, cy + Math.sin(angle) * r); });
  ctx.restore();
}
