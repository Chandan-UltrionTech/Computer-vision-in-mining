import { test } from "node:test";
import assert from "node:assert/strict";
import { storyAt, storyBeats } from "../src/experience/core/storyBeats";
import { capabilities, sceneRegistry } from "../src/experience/core/sceneRegistry";
import { transitionShots } from "../src/experience/transitions/choreography";
test("source identities survive physical journey order",()=>{
 assert.deepEqual(Object.values(capabilities).map(cap=>cap.number).sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10,11,12]);
 assert.deepEqual(sceneRegistry.filter(s=>s.capability).slice(3,6).map(s=>s.capability!.number),[6,4,5]);
});
test("results confirm completed physical consequences",()=>{
 for(const [id, finished] of Object.entries({bucket:.91,driver:.90,conveyor:.90,sorter:.89,safety:.86,survey:.90,thermal:.79})){
  const beats=storyBeats[id as keyof typeof storyBeats]!;
  assert.ok(beats.find(b=>b.state==='result')!.at>finished,id);
 }
});
test("scene clocks reverse without persistent semantic side effects",()=>{
 assert.deepEqual([.95,.8,.6,.45,.34,.1].map(p=>storyAt('conveyor',p)),['result','action','solution','observing','problem','normal']);
 for(const scene of sceneRegistry) assert.equal(storyAt(scene.id,0),'normal');
});
test("physical shots have different durations and source coordinates",()=>{
 assert.ok(new Set(Object.values(transitionShots).map(s=>s.start)).size>8);
 assert.equal(transitionShots.conveyor!.kind,'sameBelt');
 assert.deepEqual(transitionShots.crusher!.from,[828,650]);
});
