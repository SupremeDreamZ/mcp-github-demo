import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=matchMedia('(max-width: 760px)').matches;
const stage=$('#stage'),status=$('#status'),fallback=$('#fallback');
let scene,camera,renderer,clock,rig,blimp,periscope,odyssey,active=0,selected='body',rolling=false,pan=0,tilt=0,drag=false,lastX=0,lastY=0,audioCtx,transportGain;
const parts={},home={};

function mat(color,metalness=.2,roughness=.55){return new THREE.MeshStandardMaterial({color,metalness,roughness})}
const M={carbon:mat(0x17191b,.28,.45),metal:mat(0x777b7c,.92,.25),black:mat(0x0b0c0d,.65,.38),rubber:mat(0x070707,.03,.92),glass:new THREE.MeshPhysicalMaterial({color:0x8fb7ff,transmission:.72,transparent:true,opacity:.72,roughness:.08,metalness:0,thickness:.2,ior:1.45}),amber:new THREE.MeshBasicMaterial({color:0xe8a33d}),red:new THREE.MeshBasicMaterial({color:0xff3b30})};
function box(w,h,d,material=M.carbon,r=.08){const g=new THREE.BoxGeometry(w,h,d,2,2,2);const mesh=new THREE.Mesh(g,material);mesh.castShadow=mesh.receiveShadow=true;return mesh}
function cyl(r,len,material=M.black,segments=32){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,segments),material);mesh.rotation.z=Math.PI/2;mesh.castShadow=mesh.receiveShadow=true;return mesh}
function ring(r,t,w,material=M.rubber){const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,t,10,48),material);mesh.rotation.y=Math.PI/2;mesh.scale.x=w;mesh.castShadow=true;return mesh}
function remember(name,obj){parts[name]=obj;home[name]=obj.position.clone();return obj}

function makeRig(){
 const root=new THREE.Group();
 const body=remember('body',new THREE.Group());root.add(body);
 const shell=box(4.4,2.7,2.2,M.carbon);body.add(shell);
 const top=box(4.55,.16,2.35,M.metal);top.position.y=1.34;body.add(top);const bottom=top.clone();bottom.position.y=-1.34;body.add(bottom);
 for(const x of [-2.08,2.08]){const rail=box(.16,2.55,2.34,M.metal);rail.position.x=x;body.add(rail)}
 const plate=box(2.2,.62,.06,M.black);plate.position.set(.45,-.55,1.13);body.add(plate);
 const screen=box(1.35,.38,.03,new THREE.MeshBasicMaterial({color:0x58d989}));screen.position.set(.12,-.55,1.18);body.add(screen);
 for(let i=0;i<8;i++){const screw=cyl(.055,.03,M.black,16);screw.rotation.x=Math.PI/2;screw.rotation.z=0;screw.position.set(-1.7+(i%4)*1.15,i<4?.95:-.95,1.13);body.add(screw)}
 const lens=remember('lens',new THREE.Group());lens.position.x=-3.35;root.add(lens);
 const barrel=cyl(1.12,2.5,M.black,48);lens.add(barrel);
 [0,-.55,.65].forEach((x,i)=>{const g=ring(i===1?1.22:1.16,.08,1,M.rubber);g.position.x=x;lens.add(g)});
 const front=cyl(.96,.12,M.glass,48);front.position.x=-1.32;lens.add(front);
 const matte=box(.18,2.8,3.1,M.black);matte.position.x=-1.58;lens.add(matte);
 const mag=remember('magazine',new THREE.Group());mag.position.set(3.2,.15,0);root.add(mag);
 const magBody=box(2.25,2.45,2.05,M.carbon);mag.add(magBody);
 const reel1=cyl(.73,.08,M.metal,40);reel1.rotation.z=0;reel1.rotation.x=Math.PI/2;reel1.position.set(0,.55,1.08);mag.add(reel1);const reel2=reel1.clone();reel2.position.y=-.62;mag.add(reel2);
 const lcd=remember('lcd',new THREE.Group());lcd.position.set(.35,-.55,1.22);root.add(lcd);
 const lcdFrame=box(2.35,1.05,.16,M.black);lcd.add(lcdFrame);const lcdGlow=box(1.55,.55,.03,new THREE.MeshBasicMaterial({color:0x5dff9c}));lcdGlow.position.z=.1;lcd.add(lcdGlow);
 const finder=remember('finder',new THREE.Group());finder.position.set(.6,2.05,.2);root.add(finder);
 const finderBody=box(1.6,.78,.75,M.black);finder.add(finderBody);const eyepiece=cyl(.3,.65,M.rubber,32);eyepiece.position.x=.95;finder.add(eyepiece);const finderGlass=cyl(.23,.05,M.glass,32);finderGlass.position.x=-.83;finder.add(finderGlass);
 const handle=cyl(.11,2.1,M.metal,24);handle.rotation.z=0;handle.position.set(.15,1.65,.2);root.add(handle);
 for(const z of [-1.42,1.42]){const rod=cyl(.07,7.4,M.metal,20);rod.position.set(-.4,-1.72,z);root.add(rod)}
 root.rotation.y=.2;return root;
}

function makeBlimp(){const g=new THREE.Group();const shell=box(8.8,4.8,4.7,new THREE.MeshStandardMaterial({color:0x151515,metalness:.25,roughness:.66,transparent:true,opacity:.86}));g.add(shell);const opening=box(3.0,3.0,.08,M.black);opening.position.set(-4.43,0,0);g.add(opening);g.visible=false;return g}
function makePeriscope(){const g=new THREE.Group();const stem=box(.58,3.1,.65,M.black);g.add(stem);const top=box(2.25,.62,.72,M.black);top.position.set(.8,1.25,0);g.add(top);const mirror=box(.55,.48,.03,M.glass);mirror.position.set(1.92,1.25,.38);g.add(mirror);g.visible=false;return g}
function makeOdyssey(){const g=new THREE.Group();
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(120,120,1,1),new THREE.MeshStandardMaterial({color:0x07131d,metalness:.35,roughness:.42}));sea.rotation.x=-Math.PI/2;sea.position.y=-2;g.add(sea);
 const hull=box(9,1.6,2.5,mat(0x332016,.05,.76));hull.position.set(2,-.7,-15);g.add(hull);
 const bow=new THREE.Mesh(new THREE.ConeGeometry(1.25,3.4,4),mat(0x332016,.05,.76));bow.rotation.z=Math.PI/2;bow.rotation.y=Math.PI/4;bow.position.set(-3.9,-.7,-15);g.add(bow);
 const deck=box(8.2,.18,2.1,mat(0x6a4227,.02,.73));deck.position.set(2,.12,-15);g.add(deck);
 const mast=cyl(.12,7,mat(0x6c4629,.05,.67),20);mast.rotation.z=0;mast.position.set(1,3,-15);g.add(mast);
 const sail=new THREE.Mesh(new THREE.PlaneGeometry(4.8,4.4),new THREE.MeshStandardMaterial({color:0xc8b991,side:THREE.DoubleSide,roughness:.9}));sail.position.set(1,3.3,-14.9);g.add(sail);
 for(let i=0;i<8;i++){const oar=cyl(.055,4.8,mat(0x664126,.05,.75),14);oar.rotation.z=(i%2?1:-1)*.55;oar.position.set(-.7+i*.75,-.6,-15+(i%2?1.7:-1.7));g.add(oar)}
 const moon=new THREE.Mesh(new THREE.SphereGeometry(1.4,24,16),new THREE.MeshBasicMaterial({color:0xffe4b1}));moon.position.set(-7,9,-27);g.add(moon);
 g.visible=false;return g}

function resetParts(){for(const [name,obj] of Object.entries(parts)){obj.position.lerp(home[name],reduced?1:.18);obj.traverse(c=>{if(c.material&&c.material.emissive)c.material.emissive.setHex(0x000000)})}}
function highlight(name){selected=name;$$('.part-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.part===name));const copy={body:'Carbon-fiber center body, machined frame, recessed hardware, and the horizontal film gate.',lens:'Large-format barrel with geared focus and iris rings, transmitted front glass, and a compact matte box.',magazine:'Side film magazine carrying the 65mm load and feeding the horizontal 15-perforation transport.',lcd:'Local telemetry for frame rate, remaining film, voltage, current, temperature, and transport state.',finder:'Reflex finder and video-tap assembly mounted above the main chassis.'};$('#part-copy').textContent=copy[name];}
function setActive(index){active=index;$$('.section').forEach((s,i)=>s.classList.toggle('active',i===index));$('#anatomy-ui').classList.toggle('show',index===2);$('#operator-ui').classList.toggle('show',index===6);if(index!==6)$('#letterbox').classList.remove('on')}
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;$('#progress i').style.height=`${max?scrollY/max*100:0}%`;const y=innerHeight*.46;let best=0,dist=1e9;$$('.section').forEach((s,i)=>{const r=s.getBoundingClientRect(),d=Math.abs((r.top+r.bottom)/2-y);if(d<dist){dist=d;best=i}});if(best!==active)setActive(best)}
function resize(){if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.fov=mobile?48:38;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.15:1.5));renderer.setSize(innerWidth,innerHeight)}
function setupAudio(){if(audioCtx)return;audioCtx=new (window.AudioContext||window.webkitAudioContext)();const gain=audioCtx.createGain();gain.gain.value=.045;gain.connect(audioCtx.destination);transportGain=gain;const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(.35+.25*Math.sin(i*.013));const src=audioCtx.createBufferSource();src.buffer=buffer;src.loop=true;const filter=audioCtx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=920;filter.Q.value=.55;src.connect(filter).connect(gain);src.start();gain.gain.value=0}
function setRolling(on){rolling=on;$('#operator-ui').classList.toggle('recording',on);$('#roll').textContent=on?'Stop camera':'Roll camera';setupAudio();if(audioCtx?.state==='suspended')audioCtx.resume();if(transportGain)transportGain.gain.setTargetAtTime(on?.055:0,audioCtx.currentTime,.08)}

async function init(){
 const probe=document.createElement('canvas');if(!probe.getContext('webgl2')&&!probe.getContext('webgl')){fallback.style.display='grid';throw new Error('WebGL unavailable')}
 scene=new THREE.Scene();scene.background=new THREE.Color(0x050505);scene.fog=new THREE.Fog(0x050505,26,65);
 camera=new THREE.PerspectiveCamera(mobile?48:38,innerWidth/innerHeight,.1,140);camera.position.set(12,4.2,23);camera.lookAt(0,0,0);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance',failIfMajorPerformanceCaveat:false});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.prepend(renderer.domElement);resize();
 scene.add(new THREE.HemisphereLight(0xb8c8ff,0x130d08,2.2));const key=new THREE.DirectionalLight(0xffd7a8,4.2);key.position.set(-8,11,9);key.castShadow=true;key.shadow.mapSize.set(mobile?1024:1536,mobile?1024:1536);scene.add(key);const rim=new THREE.PointLight(0xe8a33d,42,30,1.5);rim.position.set(7,5,-7);scene.add(rim);const fill=new THREE.PointLight(0x8ba8ff,24,35,1.6);fill.position.set(10,2,8);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),mat(0x070707,.25,.46));floor.rotation.x=-Math.PI/2;floor.position.y=-2.1;floor.receiveShadow=true;scene.add(floor);
 rig=makeRig();scene.add(rig);blimp=makeBlimp();scene.add(blimp);periscope=makePeriscope();scene.add(periscope);odyssey=makeOdyssey();scene.add(odyssey);clock=new THREE.Clock();status.textContent='WebGL mobile renderer · ready';
 requestAnimationFrame(loop);updateScroll();
}

function loop(now){requestAnimationFrame(loop);if(!renderer)return;const t=clock.getElapsedTime();if(active!==6){const baseFov=mobile?48:38;if(camera.fov!==baseFov){camera.fov=baseFov;camera.updateProjectionMatrix()}}resetParts();rig.visible=active<7&&active!==6;odyssey.visible=active>=6;blimp.visible=active===3;periscope.visible=active===4;
 if(active===0){rig.scale.setScalar(.78);rig.position.set(.1,-.15,0);rig.rotation.y=.22+Math.sin(t*.25)*.05;camera.position.lerp(new THREE.Vector3(12,4.2,23),reduced?1:.055);camera.lookAt(0,0,0)}
 if(active===1){rig.scale.setScalar(.88);rig.position.set(0,-.2,0);rig.rotation.y=.5;camera.position.lerp(new THREE.Vector3(10,3.4,22),reduced?1:.06);camera.lookAt(-1,0,0)}
 if(active===2){rig.scale.setScalar(.72);rig.position.set(0,-.35,0);rig.rotation.y=.15;const offsets={body:[0,0,0],lens:[-2.4,0,0],magazine:[2.3,.15,0],lcd:[0,-1.4,1],finder:[0,1.65,0]};for(const [name,obj] of Object.entries(parts)){const h=home[name],o=offsets[name];const target=new THREE.Vector3(h.x+o[0],h.y+o[1],h.z+o[2]);obj.position.lerp(target,reduced?1:.16);if(name===selected)obj.traverse(c=>{if(c.material&&c.material.emissive)c.material.emissive.setHex(0x5a2600)})}camera.position.lerp(new THREE.Vector3(12,4.8,25),reduced?1:.06);camera.lookAt(0,0,0)}
 if(active===3){rig.scale.setScalar(.66);rig.position.set(0,-.2,0);rig.rotation.y=.18;blimp.scale.setScalar(.72);blimp.position.set(0,-.15,0);camera.position.lerp(new THREE.Vector3(13,4.4,25),reduced?1:.05);camera.lookAt(0,0,0)}
 if(active===4){rig.scale.setScalar(.62);rig.position.set(0,-.7,0);rig.rotation.y=-.3;periscope.scale.setScalar(.9);periscope.position.set(0,1.1,0);camera.position.lerp(new THREE.Vector3(11,5.5,23),reduced?1:.05);camera.lookAt(0,.6,0)}
 if(active===5){rig.scale.setScalar(.54);rig.position.set(0,-.25,0);rig.rotation.y=-.65;camera.position.lerp(new THREE.Vector3(13,4.2,24),reduced?1:.05);camera.lookAt(0,0,0)}
 if(active===6){const focus=+$('#focus').value/100;camera.fov=lerp(54,40,focus);camera.updateProjectionMatrix();const target=new THREE.Vector3(1.5+pan*8,-.4-tilt*5,lerp(-10,-17,focus));camera.position.lerp(new THREE.Vector3(0,2.2,9.5),reduced?1:.08);camera.lookAt(target);odyssey.rotation.y=Math.sin(t*.25)*.01;$('#focus-out').textContent=focus<.35?'Foreground':focus<.7?'Midship':'Ship'}
 if(active===7){camera.fov=48;camera.updateProjectionMatrix();camera.position.lerp(new THREE.Vector3(0,3,18),reduced?1:.04);camera.lookAt(1,-.2,-15)}
 renderer.render(scene,camera)
}

window.addEventListener('resize',resize,{passive:true});window.addEventListener('scroll',updateScroll,{passive:true});
$$('.part-tabs button').forEach(b=>b.addEventListener('click',()=>highlight(b.dataset.part)));
$('#focus').addEventListener('input',()=>{});$('#imax').addEventListener('click',()=>{$('#imax').classList.add('active');$('#standard').classList.remove('active');$('#letterbox').classList.remove('on')});$('#standard').addEventListener('click',()=>{$('#standard').classList.add('active');$('#imax').classList.remove('active');$('#letterbox').classList.add('on')});$('#roll').addEventListener('click',()=>setRolling(!rolling));
stage.addEventListener('pointerdown',e=>{if(active!==6)return;drag=true;lastX=e.clientX;lastY=e.clientY;stage.setPointerCapture?.(e.pointerId)});stage.addEventListener('pointermove',e=>{if(!drag||active!==6)return;pan=clamp(pan+(e.clientX-lastX)/innerWidth*1.8,-1,1);tilt=clamp(tilt+(e.clientY-lastY)/innerHeight*1.8,-1,1);lastX=e.clientX;lastY=e.clientY});stage.addEventListener('pointerup',()=>drag=false);stage.addEventListener('pointercancel',()=>drag=false);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&rolling)setRolling(false)});
init().catch(error=>{console.error(error);status.textContent='Renderer unavailable'});
