import { chromium } from '@playwright/test';
(async()=>{const b=await chromium.launch();const errors=[];
for(const [width,height] of [[1440,900],[768,1024],[390,844]]){
 const p=await b.newPage({viewport:{width,height}});p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text())});p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:3000');await p.waitForTimeout(1500);
 for(const [id,fraction] of [['arrival',0],['drill',.4],['core',.65],['safety',.6],['bucket',.65],['driver',.65],['conveyor',.65],['sizing',.65],['sorter',.7],['froth',.72],['survey',.85],['thermal',.7],['finale',.8]]){
 const y=await p.evaluate(({id,fraction})=>{let els=[...document.querySelectorAll('[data-scroll-chapter]')];let i=els.findIndex(e=>e.dataset.scrollChapter===id);return els.slice(0,i).reduce((s,e)=>s+e.offsetHeight,0)+els[i].offsetHeight*fraction},{id,fraction});
 await p.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await p.waitForTimeout(700);await p.screenshot({path:`test-results/review-${width}-${id}.png`});
 }
 await p.close();
}console.log(JSON.stringify({errors}));await b.close()})();
