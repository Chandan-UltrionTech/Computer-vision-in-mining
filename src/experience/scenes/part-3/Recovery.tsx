import type { SceneId } from "../../core/types";
import {
  Belt,
  Camera,
  Drone,
  MineFace,
  Mountains,
  Pile,
  Plant,
  Rock,
  Tank,
} from "../../illustrations/Primitives";
import { MineMap } from "../../illustrations/MineMap";

function SurveyPile() {
  return (
    <>
      <path
        d="M259 652 354 564 530 349 664 455 815 401 1056 653Z"
        fill="#e0e3d5"
      />
      <path
        d="m530 349-59 181-117 34m176-215 134 106 106 196m45-250-99 186-52-132M259 652h797"
        fill="none"
        stroke="#929c82"
      />
      {Array.from({ length: 29 }, (_, i) => (
        <path
          key={i}
          d={`m${390 + (i % 9) * 55} ${547 + Math.floor(i / 9) * 27} 5 8m-2-13 8 4`}
          stroke="#a1aa90"
          strokeWidth="1.5"
        />
      ))}
      <g data-art="cv" className="cv-layer" fill="none" stroke="#f45b3d">
        <g data-art="cloud">
          {Array.from({ length: 160 }, (_, i) => {
            const row = Math.floor(i / 16),
              col = i % 16;
            const y = 635 - row * 27;
            const x = 320 + col * 45 + Math.sin(i) * 8;
            if (y < Math.max(345, 610 - Math.sin((col / 15) * Math.PI) * 245))
              return null;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2.3"
                fill="#f45b3d"
                stroke="none"
              />
            );
          })}
        </g>
        <g data-art="mesh">
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={i}
              d={`M${260 + i * 66} 651 530 349 1056 651M${260 + i * 66} 651 815 401`}
            />
          ))}
          {Array.from({ length: 8 }, (_, i) => {
            const y = 625 - i * 32;
            const left = 290 + i * 28;
            const right = 1030 - i * 37;
            return (
              <path
                key={i}
                d={`M${left} ${y}q220-${24 + i * 2} ${right - left} 0`}
              />
            );
          })}
        </g>
        <path d="M259 691h795m-795-8v16m795-16v16M1100 651V349m-8 0h16m-16 302h16" />
        <text x="517" y="726" stroke="none" fill="#c4472d">
          width / volume / change · illustrative reconstruction
        </text>
        <text x="1119" y="502" stroke="none" fill="#c4472d">
          height
        </text>
        <path d="M320 716v32l70 12 15-44m-85 0h85" strokeDasharray="4 4" />
        <text x="134" y="751" stroke="none" fill="#c4472d">
          void geometry cutaway
        </text>
      </g>
    </>
  );
}
export function Recovery({ id }: { id: SceneId }) {
  if (id === "sorter")
    return (
      <>
        <Mountains />
        <Belt x={100} y={555} width={710} />
        <Camera x={450} y={412} />
        <Camera x={635} y={412} />
        <path
          d="M840 606 1192 643l-5 37-353-37ZM823 669l205 88 29-38-205-87Z"
          fill="#c9d0bb"
        />
        <path d="M861 674v52m70-42v64m168-100v86m-59-92v52" fill="none" />
        <Pile x={180} y={523} width={485} rows={1} />
        <g data-art="accepted">
          <Rock x={702} y={510} size={1.1} accent />
          <Rock x={745} y={491} size={0.8} accent />
        </g>
        <g data-art="rejected">
          <Rock x={680} y={548} size={0.9} />
          <Rock x={773} y={539} size={0.8} />
        </g>
        <path d="M809 614v-54h-29v54Z" fill="#8e9a7a" />
        <g data-art="jet" opacity="0" stroke="#939f7c">
          <path d="m795 561 25-68m-25 68 7-73m-7 73 42-62" />
        </g>
        <g data-art="cv" className="cv-layer" fill="none" stroke="#f45b3d">
          <path d="M644 476h146M732 478l-27 25m68-24-17 18" />
          <text x="622" y="456" fill="#c4472d" stroke="none">
            particle classification
          </text>
          <text x="1054" y="621" fill="#c4472d" stroke="none">
            keep → processing
          </text>
          <text x="1080" y="747" fill="#626d56" stroke="none">
            reject
          </text>
          <path d="M701 488q37-16 61 6l8 29-62 5Z" />
        </g>
      </>
    );
  if (id === "slurry")
    return (
      <>
        <Mountains />
        <Plant x={1060} y={464} scale={0.75} />
        <path d="M360 382h460l-114 189H475Z" fill="#d8ddcd" />
        <g data-art="mineral">
          <Rock x={575} y={414} size={2} />
          <Rock x={661} y={440} size={1.5} />
        </g>
        <path d="M435 570h306v117H435Z" fill="#e3e5da" />
        <g
          data-art="water"
          style={{ transform: "scaleY(.1)", transformOrigin: "580px 680px" }}
        >
          <path
            d="M437 591q46-12 84 0t76 0 74 0 67 0v94H437Z"
            fill="#cbd2bd"
            stroke="none"
          />
          {Array.from({ length: 38 }, (_, i) => (
            <circle
              key={i}
              cx={451 + (i % 10) * 28}
              cy={618 + Math.floor(i / 10) * 17}
              r={2 + (i % 3)}
              fill="#616e4f"
              stroke="none"
            />
          ))}
          <path
            d="M440 610q70-19 140 0t152 0m-271 33q74-21 131 0t117 0"
            fill="none"
            stroke="#919e7d"
            strokeWidth="2"
          />
        </g>
        <path d="M737 640h241v-76" fill="none" strokeWidth="24" />
        <path
          d="M737 640h241v-76"
          fill="none"
          stroke="#cdd4be"
          strokeWidth="18"
        />
        <text x="460" y="730">
          fine mineral particles + water → slurry
        </text>
      </>
    );
  if (id === "froth")
    return (
      <>
        <Mountains />
        <Plant x={1190} y={437} scale={0.5} />
        <Tank x={744} y={498} scale={1.35} />
        <g
          data-art="cv"
          className="cv-layer"
          fill="none"
          stroke="#f45b3d"
          strokeWidth="2"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={i}
              d={`M${500 + (i % 6) * 82} ${475 + Math.floor(i / 6) * 65}h43l-8-5m8 5-8 5`}
            />
          ))}
          <path d="M452 452q40-19 86 4l23 26q-41 19-88 4Z" />
          <text x="331" y="417" stroke="none" fill="#c4472d">
            bubble size / texture
          </text>
          <text x="1005" y="555" stroke="none" fill="#c4472d">
            motion / stability
          </text>
          <path d="M954 442h173v-61m-20 33 20-33 20 33" />
          <text x="1047" y="362" stroke="none" fill="#c4472d">
            process signal → operator
          </text>
          <path
            data-art="signal"
            d="M284 626h55l15-25 31 42 21-35h49"
            strokeDasharray="300"
            strokeDashoffset="300"
          />
          <text x="269" y="671" stroke="none" fill="#c4472d">
            temporal behaviour
          </text>
        </g>
      </>
    );
  if (id === "stockpile")
    return (
      <>
        <Mountains />
        <Plant x={1080} y={490} scale={0.8} />
        <Tank x={1220} y={534} scale={0.35} />
        <path d="M920 350 609 481l9 25 310-132Z" fill="#c1cbb1" />
        <path d="M806 415v159m-88-123v120m-87-78v117" fill="none" />
        <g data-art="product">
          <Rock x={615} y={485} size={0.4} />
          <Rock x={630} y={460} size={0.4} />
          <Rock x={606} y={429} size={0.3} />
        </g>
        <Pile x={325} y={676} width={580} rows={5} />
        <path
          d="M168 706q299-20 699 22t550-55"
          fill="none"
          stroke="#939f7e"
          strokeWidth="3"
        />
        <Drone x={940} y={639} scale={0.8} />
        <text x="1054" y="738">
          product inventory / site geometry
        </text>
      </>
    );
  if (id === "survey")
    return (
      <>
        <Mountains />
        <Plant x={1200} y={450} scale={0.45} />
        <SurveyPile />
        <Drone x={662} y={280} scale={0.95} />
        <g data-art="cv" className="cv-layer" stroke="#f45b3d" fill="none">
          <path
            d="M386 445h144v108H386Zm104-29h144v108H490Zm105 28h144v108H595Z"
            strokeDasharray="4 6"
          />
          <text x="975" y="335" stroke="none" fill="#c4472d">
            overlapping imagery
          </text>
        </g>
      </>
    );
  if (id === "thermal")
    return (
      <>
        <Mountains />
        <MineFace x={150} y={178} scale={1} />
        <Drone x={827} y={275} />
        <g data-art="cv" className="cv-layer">
          <g data-art="thermal">
            <path
              d="M244 475 342 299 480 264 638 306 763 365 895 337 1110 404 1200 623 200 633Z"
              fill="#f5bc89"
              fillOpacity=".7"
              stroke="#ed9a64"
            />
            <path
              d="M601 395q85-38 117 28t-26 106q-59 35-102-28t11-106M955 453q53-24 83 38t-40 84q-52 12-63-43t20-79"
              fill="#f47544"
            />
            <path
              d="M635 434q39-24 50 12t-26 46q-37 2-24-58M976 491q26-9 32 14t-24 28q-22-10-8-42"
              fill="#c9452a"
            />
            <path
              d="M593 393h138v142H593Z"
              fill="none"
              stroke="#b83b26"
              strokeDasharray="8 4"
            />
            <text x="482" y="580" stroke="none" fill="#9b301e">
              thermal anomaly → inspection target
            </text>
            <path
              d="M651 479v69l-9 11m9-11 9 11"
              fill="none"
              stroke="#b83b26"
              strokeWidth="4"
            />
          </g>
          <text x="192" y="703" stroke="none" fill="#41483a">
            RGB appearance + thermal patterns + location
          </text>
          <text x="1000" y="703" stroke="none" fill="#c4472d">
            illustrative sensor view
          </text>
        </g>
      </>
    );
  return (
    <>
      <Mountains />
      <MineMap />
    </>
  );
}
