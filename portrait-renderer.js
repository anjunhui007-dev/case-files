(()=>{
const SKINS=['#f2d2bd','#ddb092','#bc8568','#936049','#704635','#4b3028'];
const HAIRS=['#171412','#3a261e','#704b32','#ad8255','#d7c6a5','#c9c7c5','#713039','#293750'];
const EYES={brown:'#4b3429',blue:'#4e7691',green:'#557452',gold:'#a47c32',gray:'#72777c'};
const valid=(v,list,f)=>list.includes(v)?v:f;
function model(c={}){const a=c.avatar||{};return{race:c.race||'human',age:valid(a.age,['child','youth','adult','middle','elder'],'adult'),gender:valid(a.gender,['male','neutral','female'],c.sex==='여성'?'female':c.sex==='남성'?'male':'neutral'),skin:a.skin||SKINS[1],hair:a.hair||HAIRS[0],eyes:EYES[a.eyes]||EYES.brown,face:valid(a.face,['oval','round','angular','long'],'oval'),hairStyle:valid(a.hairStyle,['none','short','layered','long','bob','wavy','ponytail'],'none'),outfit:valid(a.outfit,['none','adventurer','armor','robe'],'none')}}
function render(c={},size=260){const m=model(c),S=128,cv=document.createElement('canvas');cv.width=S;cv.height=S;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
const px=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};const skin=m.skin;
// transparent canvas; body first
let headW=m.face==='round'?38:m.face==='long'?31:m.face==='angular'?35:34, headH=m.face==='long'?47:42;
if(m.age==='child'){headW+=3;headH-=2}else if(m.age==='elder'){headW-=1;headH+=2}
const hx=64-Math.floor(headW/2),hy=m.age==='child'?18:14;
// shoulders/torso vary by gender expression and age
let shoulder=m.gender==='male'?47:m.gender==='female'?39:43;if(m.age==='child')shoulder-=8;if(m.age==='elder')shoulder-=2;
px(64-shoulder,82,shoulder*2,46,skin);px(55,70,18,20,skin);px(hx,hy,headW,headH,skin);
// pixel silhouette rounding
px(hx-2,hy+8,2,25,skin);px(hx+headW,hy+8,2,25,skin);px(64-shoulder-3,89,3,39,skin);px(64+shoulder,89,3,39,skin);
// simple high-res pixel shading
x.globalAlpha=.16;px(hx,hy+headH-8,headW,8,'#5b332c');px(64-shoulder,118,shoulder*2,10,'#5b332c');px(64-shoulder,82,9,46,'#5b332c');x.globalAlpha=1;
// age marks are skin structure only
if(m.age==='middle'||m.age==='elder'){x.globalAlpha=m.age==='elder'?.25:.13;px(hx+5,hy+27,7,1,'#5b332c');px(hx+headW-12,hy+27,7,1,'#5b332c');x.globalAlpha=1}
// facial features are intentionally minimal but visible in app
const ey=m.eyes;px(50,37,10,3,'#201b19');px(68,37,10,3,'#201b19');px(53,38,4,3,ey);px(71,38,4,3,ey);px(63,48,2,7,'#9b6657');px(58,59,12,2,'#9b5960');
// hair layer
if(m.hairStyle!=='none'){const hc=m.hair;px(hx-2,hy-3,headW+4,10,hc);px(hx-3,hy+5,5,18,hc);px(hx+headW-2,hy+5,5,18,hc);if(['layered','bob','long','wavy','ponytail'].includes(m.hairStyle)){px(hx-4,hy+18,5,m.hairStyle==='long'?54:30,hc);px(hx+headW-1,hy+18,5,m.hairStyle==='long'?54:30,hc)}if(m.hairStyle==='ponytail')px(hx+headW+3,hy+17,8,38,hc)}
// clothing is optional; none means bare neutral base
if(m.outfit!=='none'){const col=c.avatar?.clothes||'#354657';px(64-shoulder,91,shoulder*2,37,col);if(m.outfit==='armor'){px(64-shoulder,87,shoulder*2,7,'#77736d');px(58,91,12,37,'#696763')}else if(m.outfit==='robe'){px(64-shoulder,91,shoulder*2,37,col);px(62,91,4,37,'#b9a77d')}}
const data=cv.toDataURL('image/png');return `<div class="pixel-portrait" style="width:${size}px;height:${size}px;background:#17130f;border-radius:18px;overflow:hidden;display:grid;place-items:center"><img src="${data}" width="${size}" height="${size}" alt="캐릭터 픽셀 초상화" style="width:100%;height:100%;image-rendering:pixelated;object-fit:contain"></div>`}
window.PortraitRenderer=Object.freeze({render,model,version:5,skins:SKINS,hairs:HAIRS});window.packedAvatar=render;
})();