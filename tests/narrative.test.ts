import { test } from "node:test";
import assert from "node:assert/strict";
import { storyAt, storyBeats } from "../src/experience/core/storyBeats";
import { capabilities, sceneRegistry } from "../src/experience/core/sceneRegistry";
import { cameraAt } from "../src/experience/world/CameraDirector";
test("source identities survive physical journey order",()=>{
 assert.deepEqual(Object.values(capabilities).map(cap=>cap.number).sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10,11,12]);
 assert.deepEqual(sceneRegistry.filter(s=>s.capability).slice(3,6).map(s=>s.capability!.number),[6,4,5]);
});
test("results confirm completed physical consequences",()=>{
 for(const [id, finished] of Object.entries({bucket:.91,driver:.76,conveyor:.90,sorter:.89,safety:.86,survey:.90,thermal:.79})){
  const beats=storyBeats[id as keyof typeof storyBeats]!;
  assert.ok(beats.find(b=>b.state==='result')!.at>finished,id);
 }
});
test("scene clocks reverse without persistent semantic side effects",()=>{
 assert.deepEqual([.95,.8,.6,.45,.34,.1].map(p=>storyAt('conveyor',p)),['result','action','solution','observing','problem','normal']);
 for(const scene of sceneRegistry) assert.equal(storyAt(scene.id,0),'normal');
});
test("camera poses meet exactly at every semantic boundary",()=>{
 for(let i=0;i<sceneRegistry.length-1;i++) {
  const exit=cameraAt(sceneRegistry[i].id,1),entry=cameraAt(sceneRegistry[i+1].id,0);
  for(const key of ['x','y','scale'] as const) assert.ok(Math.abs(exit[key]-entry[key])<1e-9,`${sceneRegistry[i].id} ${key}`);
 }
});

test("camera rests for observation and reverse seeks retrace the same pose",()=>{
 for(const scene of sceneRegistry) {
  const samples=[.1,.35,.65,.9].map(p=>cameraAt(scene.id,p));
  const backwards=[.9,.65,.35,.1].map(p=>cameraAt(scene.id,p)).reverse();
  assert.deepEqual(samples,backwards);
 }
});

test("camera moves are continuous: no cut inside any scene",()=>{
 for(const scene of sceneRegistry) {
  for(let i=1;i<=200;i++) {
   const a=cameraAt(scene.id,(i-1)/200), b=cameraAt(scene.id,i/200);
   const screen=Math.hypot(b.x-a.x,b.y-a.y)*Math.min(a.scale,b.scale,3)+Math.abs(Math.log(b.scale/a.scale))*400;
   assert.ok(screen<40,`${scene.id} jumps ${screen.toFixed(1)} at ${i/200}`);
  }
 }
});
