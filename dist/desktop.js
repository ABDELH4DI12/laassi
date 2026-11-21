"use strict";

const apps = [
  {name:"Browser",title:"Project Browser",colors:["#8adfff","#2886ef","#224caf"],drawing:'<circle cx="24" cy="24" r="15.5" fill="#d8f4ff" stroke="#effbff"/><circle cx="24" cy="24" r="12.8" fill="#3d9edf"/><path d="m33 14-5.8 13.2L15 34l6.2-13.2z" fill="#fff"/><path d="m33 14-5.8 13.2-6-6.4z" fill="#ff836a"/><circle cx="24" cy="24" r="1.4" fill="#506483"/>',empty:"No projects yet."},
  {name:"Workbench",title:"Workbench",colors:["#8fe8cd","#2ca997","#16726b"],drawing:'<rect x="7" y="10.5" width="34" height="27" rx="4.5" fill="#073f40" stroke="#bbffe4"/><path d="M8 17h32" stroke="#94e3c2"/><g fill="#bfffe2"><circle cx="12" cy="14" r=".9"/><circle cx="15.2" cy="14" r=".9"/></g><g fill="none" stroke="#b7ffdf" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m14 23 4 4-4 4m8-1h8"/></g>',empty:"No skills added yet."},
  {name:"Store",title:"Addon Store",colors:["#ffcf85","#ec984e","#ba6030"],drawing:'<path d="M10 16h28l2 22H8z" fill="#fff0c9" stroke="#ffe0aa" stroke-linejoin="round"/><path d="M17 18v-3a7 7 0 0 1 14 0v3" stroke="#884d29" fill="none" stroke-width="2.8" stroke-linecap="round"/><path d="m24 21 6 3.3v6.8l-6 3.3-6-3.3v-6.8z" fill="#b66d32"/><path d="m18 24.3 6 3.3 6-3.3m-6 3.3v6.8" fill="none" stroke="#ffe2a6" stroke-width="1.4"/>',empty:"No addons yet."},
  {name:"Cinema",title:"Cinema",colors:["#c6aaff","#9470d5","#624298"],drawing:'<g transform="rotate(-6 24 24)"><rect x="8" y="18" width="32" height="20" rx="3" fill="#403052" stroke="#ecdbff"/><path d="m8 13 30-4 1 7-30 4z" fill="#f1e5ff" stroke="#493553"/><path d="m13 12 5 6m3-7 5 6m3-7 5 6" stroke="#5e487c" stroke-width="3.3"/><path d="m21 23 9 5-9 5z" fill="#e6d2ff"/></g>',empty:"No films yet."},
  {name:"Manga",title:"Manga Shelf",colors:["#ffaaa7","#ef747e","#b84d69"],drawing:'<path d="M7 12q8-3 17 2 9-5 17-2v23q-9-2-17 2-8-4-17-2z" fill="#ffeae2" stroke="#ab4c5d"/><path d="M24 15v21" stroke="#b65868"/><path d="m10 16 10 1v6l-10-2zm0 8 4 .8v6l-4-.9zm6 1 4 .6v6l-4-.8zm12-8 10-1v5l-10 2zm0 9 10-2v6l-10 2z" fill="#bc6874"/>',empty:"No manga yet."},
  {name:"Settings",title:"Settings",colors:["#dae0ec","#94a1b6","#64728a"],drawing:'<g fill="#37445a" stroke="#edf3ff" stroke-width=".9"><path d="m21 7 6 .1 1 4 3 1.4 3.7-1.8 4.2 4.3-1.8 3.8 1.3 3 4 1-.1 5.4-4.1 1.1-1.3 2.9 1.8 3.7-4.2 4-3.7-1.7-2.9 1.3-1 3.6h-6l-1.1-3.9-3-1.2-3.6 1.7-4.2-4.2 1.8-3.7-1.2-3-4-1v-5.4l3.9-1.1 1.3-3-1.7-3.7 4.2-4.1 3.6 1.8 3-1.4z" transform="translate(2 1) scale(.91)"/><circle cx="24" cy="24" r="7.5" fill="#adb9cc"/></g>'}
];
function icon(app,instance){
  const id=instance+app.name;
  return '<span class="tile" aria-hidden="true"><svg viewBox="0 0 48 48"><defs><linearGradient id="'+id+'" x2=".25" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="'+app.colors[0]+'"/><stop offset=".58" stop-color="'+app.colors[1]+'"/><stop offset="1" stop-color="'+app.colors[2]+'"/></linearGradient></defs><rect x="1" y="1" width="46" height="46" rx="11" fill="url(#'+id+')" stroke="#ffffff66"/>'+app.drawing+'</svg></span>';
}
const q=sel=>document.querySelector(sel);
const launcher=q("#launcher"),win=q("#window"),content=q("#content"),appsButton=q("#apps");
let opener,active;
function getPref(key, fallback){try{return localStorage.getItem("afterhours-"+key)||fallback}catch{return fallback}}
function savePref(key,value){try{localStorage.setItem("afterhours-"+key,value)}catch{}}
const palettes={Cobalt:224,Amethyst:272,Jade:163};
let palette=getPref("palette","Cobalt");
if(!Object.hasOwn(palettes,palette))palette="Cobalt";
let hourFormat=getPref("clock","24");

function paintWallpaper(){
  const canvas=q("#wall"),ctx=canvas.getContext("2d");
  const w=window.innerWidth,h=window.innerHeight,d=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);
  ctx.setTransform(d,0,0,d,0,0);
  const hue=palettes[palette];
  const sky=ctx.createRadialGradient(w*.52,h*.65,0,w*.50,h*.62,Math.max(w,h)*.88);
  sky.addColorStop(0,'hsl('+hue+' 56% 13%)');
  sky.addColorStop(.55,'hsl('+hue+' 50% 7%)');sky.addColorStop(1,'hsl('+hue+' 48% 3%)');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  // Render contiguous cross-sections of two folded ribbons, back to front.
  // Extending the drawing beyond the viewport preserves its sweep on tall screens.
  const world=Math.max(w,h*.96),offset=(w-world)*.52;
  ctx.translate(offset,0);ctx.scale(world,h);
  function trace(layer,t,reverse){
    const points=110;
    for(let j=0;j<=points;j++){
      const x=(reverse?points-j:j)/points*1.05-.025;
      let y;
      if(layer===0){
        const crest=.61-.41*Math.exp(-Math.pow((x-.82+t*.09)/(.31-.05*t),2));
        y=crest+.50*t+.073*Math.sin((x*1.55-t*.92)*Math.PI*2)*t;
      }else{
        const bump=Math.exp(-Math.pow((x-.13-t*.40)/(.34-.07*t),2));
        y=.84-.35*bump+.38*t+.072*Math.sin((x*1.16+.12-t*.59)*Math.PI*2)-.20*x;
      }
      if(j===0&&!reverse)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
  }
  for(let layer=0;layer<2;layer++){
    const rows=layer===0?132:168;
    for(let i=0;i<rows;i++){
      const t=i/rows;
      const bright=layer===0?Math.exp(-t*3.8):Math.exp(-t*2.45);
      const g=ctx.createLinearGradient(0,0,1,0);
      const stops=layer===0?[[0,5],[.30,10],[.64,37],[.81,53],[1,16]]:[[0,33],[.13,56],[.34,43],[.51,17],[.72,9],[1,23]];
      for(const [p,l] of stops)g.addColorStop(p,'hsl('+(hue+8*p)+' 74% '+(4.5+l*bright)+'%)');
      ctx.beginPath();trace(layer,t,false);trace(layer,(i+1.15)/rows,true);
      ctx.closePath();ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();trace(layer,t,false);
      ctx.strokeStyle='hsla('+(hue-2)+' 86% '+(64+12*bright)+'% / '+((layer===0?.035:.047)+bright*(i%3===0?.43:.25))+')';
      ctx.lineWidth=.68/h;ctx.stroke();
    }
  }
}
let resizeFrame;
window.addEventListener("resize",()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(paintWallpaper)});
function clock(){
  const date=new Date();
  q(".date").textContent=date.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
  q(".time").textContent=new Intl.DateTimeFormat("en-US",{hour:"2-digit",minute:"2-digit",hourCycle:hourFormat==="12"?"h12":"h23"}).format(date);
  q(".time").dateTime=date.toISOString();
}
function toggleLauncher(show){launcher.hidden=!show;appsButton.setAttribute("aria-expanded",String(show));if(show)launcher.querySelector("button").focus()}
function setActive(name){active=name;document.querySelectorAll(".dock button").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.app===name)))}
function closeWindow(){win.hidden=true;setActive(null);if(opener&&opener.isConnected)opener.focus()}
function openApp(app,trigger){
  opener=launcher.contains(trigger)?appsButton:trigger;
  toggleLauncher(false);setActive(app.name);q("#window-name").textContent=app.title;
  if(app.name==="Settings"){
    content.innerHTML='<div class="settings"><label class="setting">Wallpaper<select id="palette">'+Object.keys(palettes).map(p=>'<option>'+p+'</option>').join('')+'</select></label><label class="setting">Clock format<select id="format"><option value="24">24-hour</option><option value="12">12-hour</option></select></label></div>';
    const swatch=q("#palette"),format=q("#format");swatch.value=palette;format.value=hourFormat;
    swatch.onchange=()=>{palette=swatch.value;savePref("palette",palette);paintWallpaper()};
    format.onchange=()=>{hourFormat=format.value;savePref("clock",hourFormat);clock()};
  }else{content.innerHTML='<div class="empty">'+icon(app,"window")+'<p>'+app.empty+'</p></div>'}
  win.hidden=false;win.querySelector(".close").focus();
}
for(const [selector,instance] of [[".dock","dock"],[".app-grid","grid"]]){
  const host=q(selector);
  for(const app of apps){
    if(instance==="dock"&&app.name==="Settings"){const sep=document.createElement("span");sep.className="dock-rule";host.append(sep)}
    const button=document.createElement("button");button.dataset.app=app.name;button.setAttribute("aria-label",app.title);
    if(instance==="dock")button.setAttribute("aria-pressed","false");
    button.innerHTML=icon(app,instance)+'<span class="caption">'+app.name+'</span>';
    button.onclick=()=>openApp(app,button);host.append(button);
  }
}
appsButton.onclick=()=>toggleLauncher(launcher.hidden);
q("#controls").onclick=e=>openApp(apps[5],e.currentTarget);
q(".close").onclick=closeWindow;
document.addEventListener("pointerdown",e=>{if(!launcher.hidden&&!launcher.contains(e.target)&&!appsButton.contains(e.target))toggleLauncher(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!launcher.hidden){toggleLauncher(false);appsButton.focus()}else if(!win.hidden)closeWindow()}});
clock();setInterval(clock,1000);paintWallpaper();
