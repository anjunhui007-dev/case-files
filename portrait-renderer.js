(()=>{
const valid=(v,l,f)=>l.includes(v)?v:f;
function model(c={}){const a=c.avatar||{};return{view:valid(a.view,['full','portrait'],'full'),face:valid(a.face,['oval','round','angular','long','soft'],'oval'),body:valid(a.body,['slim','average','curvy','sturdy','tall'],'average')}}
const skin='#d9aa8e',shadow='#a97460',deep='#765044',light='#f0cbb3',line='#4a342e';
function make(c={}){const m=model(c),cv=document.createElement('canvas');cv.width=256;cv.height=384;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;const p=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),Math.round(w),Math.round(h))};
// Canonical full-body model. Portrait is a crop of this exact canvas, never a redraw.
let fw={round:70,long:57,angular:64,oval:63,soft:66}[m.face],fh=m.face==='long'?88:80,hx=128-fw/2,hy=25;
// head silhouette with stepped pixel curves
p(hx+10,hy,fw-20,3,shadow);p(hx+5,hy+3,fw-10,4,skin);p(hx+2,hy+7,fw-4,8,skin);p(hx,hy+15,fw,44,skin);p(hx+2,hy+59,fw-4,9,skin);p(hx+6,hy+68,fw-12,7,skin);p(hx+12,hy+75,fw-24,4,skin);if(m.face==='angular'){p(hx+4,hy+57,5,10,shadow);p(hx+fw-9,hy+57,5,10,shadow)}if(m.face==='round'){p(hx-2,hy+24,3,28,skin);p(hx+fw-1,hy+24,3,28,skin)}
// facial planes: restrained semi-real pixel shading
p(hx+3,hy+19,4,37,shadow);p(hx+fw-7,hy+19,4,37,light);p(hx+10,hy+11,18,3,light);p(hx+12,hy+32,15,3,line);p(hx+fw-27,hy+32,15,3,line);p(hx+15,hy+35,10,5,'#efe4db');p(hx+fw-25,hy+35,10,5,'#efe4db');p(hx+18,hy+36,4,4,'#3b2b25');p(hx+fw-22,hy+36,4,4,'#3b2b25');p(125,hy+43,4,14,shadow);p(129,hy+43,2,12,light);p(117,hy+63,22,2,shadow);p(121,hy+65,14,2,light);p(112,hy+72,32,2,shadow);
// neck
p(113,hy+78,30,27,skin);p(113,hy+78,5,27,shadow);p(138,hy+78,5,27,light);
// body proportions
let sw=43,waist=31,hip=37,torso=102,leg=151;if(m.body==='slim'){sw=38;waist=27;hip=33}else if(m.body==='curvy'){sw=41;waist=28;hip=42}else if(m.body==='sturdy'){sw=49;waist=38;hip=43}else if(m.body==='tall'){sw=40;waist=29;hip=35;torso=110;leg=159}
let sy=hy+101,wy=sy+70,py=sy+torso;
// shoulders and tapered torso using horizontal bands
for(let yy=0;yy<torso;yy+=3){let t=yy/torso,w;if(t<.16)w=sw-(sw-waist)*(t/.16)*.25;else if(t<.68)w=sw-(sw-waist)*((t-.16)/.52);else w=waist+(hip-waist)*((t-.68)/.32);p(128-w,sy+yy,w*2,3,skin);p(128-w,sy+yy,4,3,shadow);p(128+w-4,sy+yy,4,3,light)}
// collarbone and torso planes
p(94,sy+13,27,2,light);p(135,sy+13,27,2,light);p(113,sy+7,30,2,shadow);p(124,sy+20,8,36,shadow);p(126,sy+20,4,36,light);p(128-waist,wy,waist*2,3,shadow);
// arms, slight anatomical taper
for(let yy=0;yy<105;yy+=3){let aw=yy<55?11:9,off=sw+8-(yy*.035);p(128-off-aw,sy+12+yy,aw,3,skin);p(128+off,sy+12+yy,aw,3,skin);p(128-off-aw,sy+12+yy,3,3,shadow);p(128+off+aw-3,sy+12+yy,3,3,light)}
// pelvis + legs
p(128-hip,py-2,hip*2,18,skin);p(128-hip,py-2,5,18,shadow);let gap=5,lw=Math.max(14,Math.floor((hip-gap)/2));for(let yy=0;yy<leg;yy+=3){let taper=yy/leg,w=Math.max(10,Math.round(lw-(lw-10)*taper));p(128-gap-w,py+15+yy,w,3,skin);p(128+gap,py+15+yy,w,3,skin);p(128-gap-w,py+15+yy,3,3,shadow);p(128+gap+w-3,py+15+yy,3,3,light)}
// feet
p(128-gap-18,Math.min(376,py+leg+10),18,7,skin);p(128+gap,Math.min(376,py+leg+10),18,7,skin);return cv}
function render(c={},size=300,forced){const m=model(c),mode=forced||m.view,src=make(c),out=document.createElement('canvas');out.width=256;out.height=256;let q=out.getContext('2d');q.imageSmoothingEnabled=false;if(mode==='portrait'){// same full body, camera zoom only
q.drawImage(src,64,10,128,128,0,0,256,256)}else{q.drawImage(src,0,0,256,384,43,0,170,256)}const data=out.toDataURL('image/png');return `<div class="pixel-portrait pixel-${mode}" style="width:${size}px;height:${size}px;background:radial-gradient(circle at 50% 30%,#30261c,#100d0a 72%);border-radius:18px;overflow:hidden"><img src="${data}" alt="캐릭터 픽셀 ${mode==='full'?'전신':'초상화'}" style="width:100%;height:100%;image-rendering:pixelated;object-fit:contain"></div>`}
window.PortraitRenderer=Object.freeze({render,model,version:7});window.packedAvatar=render;
})();