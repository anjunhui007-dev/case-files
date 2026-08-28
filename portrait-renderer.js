(()=>{
const pick=(v,a,f)=>a.includes(v)?v:f;
function model(c={}){const a=c.avatar||{};return{view:pick(a.view,['full','portrait'],'full'),gender:pick(a.gender,['female','neutral','male'],'female'),height:pick(a.height,['short','average','tall'],'average'),face:pick(a.face,['oval','round','soft','angular','long'],'oval'),body:pick(a.body,['slim','average','curvy','sturdy','athletic'],'average')}}
const C={skin:'#d9aa8e',s1:'#c18d73',s2:'#a66f5c',hi:'#efd0bb',line:'#68483d',eye:'#49352f',white:'#eee4dc'};
function make(c={}){const m=model(c),cv=document.createElement('canvas');cv.width=320;cv.height=480;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;const p=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};const band=(cx,y,w,h)=>{p(cx-w,y,w*2,h,C.skin);p(cx-w,y,3,h,C.s1);p(cx+w-3,y,3,h,C.hi)};
const cx=160, faceW={oval:62,round:68,soft:66,angular:64,long:58}[m.face],faceH=m.face==='long'?82:m.face==='round'?72:77,hx=cx-faceW/2,hy=24;
// smoother 1-3px stepped silhouette
const rows=[[10,0,faceW-20],[6,2,faceW-12],[3,5,faceW-6],[1,9,faceW-2],[0,14,faceW]];rows.forEach(([i,y,w])=>p(hx+i,hy+y,w,6,C.skin));p(hx,hy+20,faceW,35,C.skin);p(hx+2,hy+55,faceW-4,8,C.skin);p(hx+5,hy+63,faceW-10,7,C.skin);p(hx+9,hy+70,faceW-18,5,C.skin);p(hx+15,hy+75,faceW-30,3,C.s1);p(hx+2,hy+18,3,38,C.s1);p(hx+faceW-5,hy+18,3,38,C.hi);p(hx+10,hy+10,18,2,C.hi);
// restrained neutral face, enough detail to read shape
let ey=hy+33;p(hx+12,ey,15,2,C.line);p(hx+faceW-27,ey,15,2,C.line);p(hx+15,ey+3,10,4,C.white);p(hx+faceW-25,ey+3,10,4,C.white);p(hx+19,ey+3,3,4,C.eye);p(hx+faceW-22,ey+3,3,4,C.eye);p(cx-2,hy+45,3,12,C.s1);p(cx+1,hy+45,2,10,C.hi);p(cx-8,hy+62,16,2,C.s1);p(cx-5,hy+64,10,1,C.hi);
// neck width reacts to gender/body
let neck=m.gender==='male'?18:m.gender==='neutral'?15:13;if(m.body==='sturdy'||m.body==='athletic')neck+=2;band(cx,hy+77,neck,28);
let shoulder,waist,hip,arm,thigh;
if(m.gender==='female'){shoulder=43;waist=30;hip=42;arm=9;thigh=16}else if(m.gender==='male'){shoulder=52;waist=39;hip=36;arm=12;thigh=17}else{shoulder=47;waist=34;hip=38;arm=10;thigh=16}
if(m.body==='slim'){shoulder-=4;waist-=4;hip-=3;arm-=1;thigh-=2}if(m.body==='curvy'){waist-=2;hip+=6;thigh+=3}if(m.body==='sturdy'){shoulder+=5;waist+=6;hip+=4;arm+=3;thigh+=3}if(m.body==='athletic'){shoulder+=6;waist+=2;hip+=1;arm+=3;thigh+=2}
let scale=m.height==='short'?.90:m.height==='tall'?1.10:1, torso=Math.round(112*scale),legs=Math.round(190*scale),sy=hy+101,py=sy+torso;
// torso continuous taper, 2px bands = much finer contour
for(let y=0;y<torso;y+=2){let t=y/torso,w=t<.18?shoulder-(shoulder-waist)*(.18? t/.18:0)*.28:t<.67?shoulder-(shoulder-waist)*((t-.18)/.49):waist+(hip-waist)*((t-.67)/.33);band(cx,sy+y,w,2)}
// anatomy shading, not rectangular chest blocks
p(cx-31,sy+14,24,2,C.hi);p(cx+7,sy+14,24,2,C.hi);p(cx-14,sy+7,28,2,C.s1);p(cx-2,sy+24,2,44,C.s1);p(cx+1,sy+24,1,40,C.hi);if(m.gender==='female'){p(cx-28,sy+29,25,2,C.s1);p(cx+3,sy+29,25,2,C.s1);p(cx-23,sy+31,18,2,C.hi);p(cx+5,sy+31,18,2,C.hi)}else if(m.gender==='male'||m.body==='athletic'){p(cx-31,sy+31,28,2,C.s1);p(cx+3,sy+31,28,2,C.s1);p(cx-25,sy+34,20,2,C.hi);p(cx+5,sy+34,20,2,C.hi)}
// tapered arms
let armLen=Math.round(126*scale);for(let y=0;y<armLen;y+=2){let w=Math.max(6,arm-(y/armLen)*2),off=shoulder+7-(y/armLen)*4;band(cx-off-w,sy+13+y,w/2,2);band(cx+off+w,sy+13+y,w/2,2)}
// pelvis
for(let y=0;y<20;y+=2){let w=hip-(y/20)*2;band(cx,py+y,w,2)}
// legs with thigh/calf shaping
const gap=5;for(let y=0;y<legs;y+=2){let t=y/legs,w=t<.42?thigh-(t/.42)*3:t<.72?(thigh-3)-((t-.42)/.30)*3:(thigh-6)+((t-.72)/.28)*1;w=Math.max(8,w);band(cx-gap-w,py+18+y,w/2,2);band(cx+gap+w,py+18+y,w/2,2)}
let fy=Math.min(470,py+18+legs);p(cx-gap-19,fy,19,6,C.skin);p(cx+gap,fy,19,6,C.skin);return cv}
function render(c={},size=320,forced){const m=model(c),mode=forced||m.view,src=make(c),out=document.createElement('canvas');out.width=320;out.height=320;const q=out.getContext('2d');q.imageSmoothingEnabled=false;if(mode==='portrait')q.drawImage(src,80,10,160,160,0,0,320,320);else q.drawImage(src,0,0,320,480,53,0,214,320);let data=out.toDataURL('image/png');return `<div class="pixel-portrait pixel-${mode}" style="width:${size}px;height:${size}px;background:radial-gradient(circle at 50% 28%,#30261c,#100d0a 72%);border-radius:18px;overflow:hidden"><img src="${data}" alt="캐릭터 픽셀 ${mode==='full'?'전신':'초상화'}" style="width:100%;height:100%;image-rendering:pixelated;object-fit:contain"></div>`}
window.PortraitRenderer=Object.freeze({render,model,version:8});window.packedAvatar=render;
})();