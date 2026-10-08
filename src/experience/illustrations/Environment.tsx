import type { SceneId } from '../core/types';
import { Plant, Rock, Worker } from './Primitives';

/** Different physical locations, composed behind the principal machinery. */
export function Environment({ id }: { id: SceneId }) {
  const industrial = ['crusher','conveyor','sizing','sorter','slurry','froth','stockpile'].includes(id);
  const geological = ['arrival','drill','grade','blast','fragments','excavation','safety','bucket','loading'].includes(id);
  const benchFrame: Partial<Record<SceneId,string>> = {arrival:'translate(0 0)',drill:'translate(-90 45) scale(1.15 .9)',grade:'translate(100 -65) scale(.9 1.1)',blast:'translate(-130 -30) scale(1.2 1)',fragments:'translate(180 -70) scale(.85 1)',excavation:'translate(180 -70) scale(.85 1)',safety:'translate(180 -70) scale(.85 1)',bucket:'translate(180 -70) scale(.85 1)',loading:'translate(180 -70) scale(.85 1)'};
  return <g data-art="environment" stroke="#858a92" strokeWidth="1.6" fill="none">
    {geological && <g transform={benchFrame[id]}>
      <path d="M-30 398 112 338 297 354 420 286 587 315 693 255 890 291 1068 272 1425 361L1425 405 1079 320 874 343 690 305 590 358 418 332 299 399 104 387Z" fill="#edeef0"/>
      <path d="M-30 455 113 410 300 432 417 366 600 399 698 347 895 381 1100 365 1425 441M-30 506 111 466 310 488 426 425 593 452 710 412 892 433 1098 421 1425 490"/>
      {Array.from({length:24},(_,i)=><path key={i} d={`m${65+i*57} ${422+(i%4)*22} 8 17-3 11m-8-9-5-12`} strokeWidth="1.1"/>)}
      <path d="M60 688q245-36 517-9t783-6M65 706q263-29 515-11t783-5" stroke="#636872"/>
      <g transform="translate(1200 540)"><path d="M0 0v-63h48v63m-7-63v-25h-9v25" fill="#f97832"/><path d="M-40-15 0-36m-30 23 0 42m18-47v47"/><text x="-13" y="49" fontSize="13">bench 04</text></g>
    </g>}
    {industrial && <>
      <g opacity=".72"><Plant x={180} y={475} scale={.52}/><Plant x={1030} y={460} scale={.7}/></g>
      <path d="M30 680V484h70v196m-57-179h43v161H43M30 540h70M30 600h70M30 659h70M270 490v-48h200v48m-200-35h200m-180-13v48m35-48v48m35-48v48m35-48v48m35-48v48"/>
      <path d="M-20 705h1440M1180 594v-55h105v55m-93 0v80m80-80v80M1120 690v-92h26v92"/>
      <path d="M60 668h140v-56h73M1220 679h130v-105" stroke="#34383f" strokeWidth="8"/>
      <path d="M60 668h140v-56h73M1220 679h130v-105" stroke="#c8ccd2" strokeWidth="4"/>
      <Worker x={1240} y={668} scale={.38}/>
      <g transform="translate(113 603)"><path d="m0 0 26-44 26 44Z" fill="#ffddbe" stroke="#17191c"/><path d="M26-30v14m0 7v2" stroke="#17191c" strokeWidth="3"/></g>
    </>}
    {id === 'haul' && <><path d="M-20 480q249-70 480-5t460-21 510 8M-20 512q229-56 460-2t440-14 540 6"/><path d="m164 553 21 33m440-37 20 35m434-15 19 25"/><path d="M80 585v-45h40v45m-40-45 20-25 20 25" fill="#f97832"/></>}
    {['survey','thermal','finale'].includes(id) && <><path d="M-30 682q230-95 460-26t434 28 590-69M-30 705q239-82 460-20t434 28 590-64"/><path d="M91 385 182 304 255 325 340 256 419 342M972 326l90-75 104 61 111-88 167 99"/><g strokeWidth="1.1">{Array.from({length:18},(_,i)=><path key={i} d={`m${90+i*73} ${672+(i%3)*8} 8 3m-2-13 6 8`}/>)}</g></>}
    {!['core','driver','bucket'].includes(id) && <g>{Array.from({length:16},(_,i)=><Rock key={i} x={100+i*79} y={700+(i%3)*7} size={.18+(i%4)*.08} variant={i}/>)}</g>}
  </g>;
}
