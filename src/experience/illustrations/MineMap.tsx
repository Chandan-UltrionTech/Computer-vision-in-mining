import {
  Belt,
  Camera,
  Drill,
  Drone,
  Excavator,
  MineFace,
  Pile,
  Place,
  Plant,
  Tank,
  Truck,
  Worker,
} from "./Primitives";

/** A separate overview composition, assembled from the same machinery seen on the journey. */
export function MineMap() {
  return (
    <>
      <MineFace x={70} y={240} scale={0.48} />
      <path
        d="M69 684q120-43 172-131t292-8q150 16 215 73t247 12q180-73 328 49"
        fill="none"
        stroke="#919b82"
        strokeWidth="18"
      />
      <path
        d="M69 684q120-43 172-131t292-8q150 16 215 73t247 12q180-73 328 49"
        fill="none"
        stroke="#faf8f2"
        strokeWidth="12"
      />
      <path
        d="M69 684q120-43 172-131t292-8q150 16 215 73t247 12q180-73 328 49"
        fill="none"
        stroke="#b6bfa6"
        strokeWidth="2"
        strokeDasharray="9 12"
      />
      <Drill x={200} y={428} scale={0.35} />
      <Pile x={400} y={510} width={205} rows={3} />
      <Excavator x={428} y={503} scale={0.35} />
      <Worker x={355} y={530} scale={0.32} />
      <Truck x={601} y={557} scale={0.4} />
      <Truck x={298} y={624} scale={0.29} />
      <Place x={720} y={510} scale={0.5}>
        <path d="M-50-70h150l-30 67H-23ZM-23-3h93v88h-93Z" fill="#d4dac6" />
        <path
          d="m-23 20 30 12-10 21 16 26m57-59-30 12 10 21-16 26"
          fill="none"
        />
      </Place>
      <Place x={756} y={554} scale={0.43}>
        <Belt width={685} />
        <Pile y={-26} width={540} rows={1} />
      </Place>
      <Plant x={1116} y={478} scale={0.58} />
      <Tank x={1130} y={617} scale={0.32} />
      <Tank x={1310} y={586} scale={0.25} />
      <Pile x={796} y={716} width={275} rows={4} />
      <path d="m1295 471-268 199 8 14 268-202Z" fill="#c9d0bb" />
      <path
        d="m1086 638 2 63m65-111 13 90m58-140 17 93"
        fill="none"
        strokeWidth="2"
      />
      <Drone x={858} y={330} scale={0.65} />
      <Camera x={918} y={537} scale={0.35} />
      <g fill="#626d56" stroke="none" fontSize="17">
        <text x="146" y="481">
          drill & geology
        </text>
        <text x="352" y="575">
          blast & excavation
        </text>
        <text x="565" y="605">
          haul road
        </text>
        <text x="692" y="492">
          crusher
        </text>
        <text x="830" y="515">
          convey & sort
        </text>
        <text x="1150" y="702">
          recover
        </text>
        <text x="870" y="755">
          stockpile
        </text>
      </g>
      <g
        data-art="cv"
        className="cv-layer"
        fill="none"
        stroke="#f45b3d"
        strokeWidth="2"
      >
        <path
          d="M198 431q127-94 245 68t157 53q85-83 170-4t141 4q154-68 214 62t-175 86M441 499q186-192 417-166t253 140"
          strokeDasharray="4 7"
        />
        {[
          [198, 431],
          [305, 426],
          [443, 499],
          [366, 524],
          [475, 485],
          [600, 552],
          [819, 551],
          [875, 551],
          [952, 551],
          [1125, 614],
          [953, 700],
          [1111, 473],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="6" fill="#f45b3d" />
            <circle cx={x} cy={y} r="13" opacity=".5" />
          </g>
        ))}
        <path d="M154 405h64v37h-64ZM335 502h38v41h-38ZM840 530h41v37h-41Z" />
        <path d="M1083 605h86l-8 14-78-1" />
        <path d="M825 716 885 655 962 623 1050 716m-225 0h225m-170-54 80 50m-32-84 39 88m-7-53-80 49m-7-46h138m-164 24h196" />
        <text x="1078" y="443" fill="#c4472d" stroke="none">
          inspection target
        </text>
      </g>
    </>
  );
}
