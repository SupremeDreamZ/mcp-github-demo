function render(now) {
  requestAnimationFrame(render);
  const mobile = width <= 760;
  if (document.hidden || (mobile && now - lastFrame < 33)) return;
  const delta = Math.min(.05, (now - lastFrame) / 1000 || .016);
  lastFrame = now;
  elapsed += delta;
  if (rolling) { transportTimer -= delta; if (transportTimer <= 0) transportTimer = 42; }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createRadialGradient(width * .48, height * .38, 10, width * .5, height * .45, Math.max(width, height) * .75);
  bg.addColorStop(0, '#262626'); bg.addColorStop(.42, '#0d0d0d'); bg.addColorStop(1, '#020202'); ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);

  if (activeSection === 6 || activeSection === 7) drawOdysseyScene();
  if (activeSection !== 6) { drawCameraSpotlight(); drawCamera(); }
  if (activeSection === 5) drawScaleSection();
  if (activeSection === 7) drawLegacy();

  if (!document.body.classList.contains('rendered')) document.body.classList.add('rendered');
}

$$('.part-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    selectedPart = button.dataset.part;
    $$('.part-tabs button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    $('#part-copy').textContent = descriptions[selectedPart];
  });
});

focusInput.addEventListener('input', updateOutputs);
tiltInput.addEventListener('input', updateOutputs);
$('#imax').addEventListener('click', () => {
  frameMode = 'imax'; document.body.classList.remove('standard-frame');
  $('#imax').classList.add('active'); $('#standard').classList.remove('active');
  $('#imax').setAttribute('aria-pressed', 'true'); $('#standard').setAttribute('aria-pressed', 'false');
});
$('#standard').addEventListener('click', () => {
  frameMode = 'standard'; document.body.classList.add('standard-frame');
  $('#standard').classList.add('active'); $('#imax').classList.remove('active');
  $('#standard').setAttribute('aria-pressed', 'true'); $('#imax').setAttribute('aria-pressed', 'false');
});
$('#roll').addEventListener('click', () => setRolling(!rolling));

stage.addEventListener('pointerdown', (event) => {
  if (activeSection !== 6) return;
  pointerDown = true; pointerX = event.clientX;
  stage.setPointerCapture?.(event.pointerId);
});
stage.addEventListener('pointermove', (event) => {
  if (!pointerDown || activeSection !== 6) return;
  targetPan = clamp(targetPan + (event.clientX - pointerX) / width * 1.6, -1, 1);
  pointerX = event.clientX;
});
stage.addEventListener('pointerup', (event) => { pointerDown = false; stage.releasePointerCapture?.(event.pointerId); });
stage.addEventListener('pointercancel', () => { pointerDown = false; });

addEventListener('resize', () => { resize(); updateSectionState(); }, { passive: true });
addEventListener('scroll', updateSectionState, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden && rolling) setRolling(false); });

if (!ctx) {
  statusCopy.textContent = 'Static camera · canvas unavailable';
} else {
  resize(); updateOutputs(); updateSectionState(); requestAnimationFrame(render);
}
