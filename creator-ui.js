(()=>{
let lastStep='';
function syncCreator(){
 const overlay=document.querySelector('#homeOverlay'),creator=overlay?.querySelector('.creator'),progress=creator?.querySelector('.creator-progress span');
 if(!overlay||!creator||!progress){lastStep='';return}
 const step=progress.textContent.trim();
 creator.style.minHeight='auto';creator.style.height='auto';creator.style.overflow='visible';creator.style.paddingTop='calc(18px + env(safe-area-inset-top))';
 if(step!==lastStep){lastStep=step;overlay.scrollTop=0;overlay.scrollLeft=0;creator.scrollIntoView({block:'start',inline:'nearest'});requestAnimationFrame(()=>{overlay.scrollTop=0;overlay.scrollLeft=0})}
}
const observer=new MutationObserver(syncCreator);observer.observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',syncCreator);syncCreator();
})();