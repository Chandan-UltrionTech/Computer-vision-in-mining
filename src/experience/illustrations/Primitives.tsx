import type { ReactNode } from "react";

export function Place({
  x = 0,
  y = 0,
  scale = 1,
  children,
}: {
  x?: number;
  y?: number;
  scale?: number;
  children: ReactNode;
}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>{children}</g>;
}
export function Rock({
  x = 0,
  y = 0,
  size = 1,
  accent = false,
}: {
  x?: number;
  y?: number;
  size?: number;
  accent?: boolean;
}) {
  return (
    <Place x={x} y={y} scale={size}>
      <path
        d="M-24 5 -16-14 0-25 17-13 27 9 17 24-13 22Z"
        fill={accent ? "#f9dfcf" : "#deded5"}
      />
      <path
        d="m-16-14 10 17 23-16M-6 3l-7 19M-6 3l23 21M-17 10l4 5M5-15l3 5M15 7l5 4"
        fill="none"
        strokeWidth="1.5"
      />
      <path d="m-19 3 4 2m22 8 2 3m-7-9 3 1" stroke="#85877f" strokeWidth="2" />
      {accent && (
        <path
          d="m-13-16 8 18 17 9"
          fill="none"
          stroke="#f45b3d"
          strokeWidth="3"
        />
      )}
    </Place>
  );
}
export function Pile({
  x = 0,
  y = 0,
  width = 600,
  rows = 3,
}: {
  x?: number;
  y?: number;
  width?: number;
  rows?: number;
}) {
  return (
    <Place x={x} y={y}>
      <g data-art="pile">
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: Math.floor(width / 55) - row * 2 }, (_, i) => (
            <Rock
              key={`${row}-${i}`}
              x={i * 55 + row * 55}
              y={-row * 39 + (i % 3) * 7}
              size={0.85 + (i % 4) * 0.14}
            />
          )),
        )}
      </g>
    </Place>
  );
}
export function Camera({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <path d="M0 0v-75h25" fill="none" />
      <path d="m12-91 52 5-4 28-49-5Z" fill="#ecebe4" />
      <path d="m57-84 12 3-3 20-11-3Z" fill="#343832" />
      <circle cx="61" cy="-73" r="5" fill="#f45b3d" />
      <path d="m17-84 22 2m-25 15 14 1" strokeWidth="1.5" />
      <g
        data-art="cv"
        className="cv-layer"
        stroke="#f45b3d"
        fill="none"
        strokeDasharray="5 7"
      >
        <path d="m62-59-75 137m75-137 97 137m-97-137 10 137" />
      </g>
    </Place>
  );
}
export function Drone({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <g data-art="drone">
        <path d="m-46 0 28 9m36 0 28-9M-18 10l-11 16m46-16 11 16" />
        <ellipse cx="0" cy="7" rx="24" ry="10" fill="#ecebe4" />
        <path d="M-19 7q19 6 38 0" fill="none" />
        <rect x="-8" y="17" width="16" height="13" rx="5" fill="#353932" />
        <circle cx="0" cy="23" r="3" fill="#f45b3d" />
        {[-46, 46].map((i) => (
          <g key={i}>
            <path d={`M${i} -7v14`} strokeWidth="4" />
            <ellipse
              data-art="rotor"
              cx={i}
              cy="-7"
              rx="24"
              ry="2"
              fill="#242620"
              strokeWidth="1"
            />
          </g>
        ))}
        <g
          data-art="cv"
          className="cv-layer"
          stroke="#f45b3d"
          strokeDasharray="5 8"
          fill="none"
        >
          <path d="M0 30-130 205M0 30l130 175M0 30v175" />
        </g>
      </g>
    </Place>
  );
}
export function Worker({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <g data-art="worker">
        <path
          d="m-12-4-4 58-10 13m38-71 5 57 10 13"
          fill="none"
          strokeWidth="10"
        />
        <path d="M-22-8-17-53q17-16 34 0L22-8Z" fill="#777c71" />
        <path d="M-19-36h37M0-59v49" stroke="#faf8f2" strokeWidth="5" />
        <path
          d="m-18-49-17 30 8 15M19-49l16 19-9 21"
          fill="none"
          strokeWidth="8"
        />
        <ellipse cx="0" cy="-74" rx="15" ry="18" fill="#faf8f2" />
        <path d="M-22-78q2-25 22-25t22 25ZM-27-78h54" fill="#e5e4db" />
        <path d="M0-102v19M7-70l4 2" fill="none" strokeWidth="2" />
        <path d="m-16 66-13 2m45-2 14 2" strokeWidth="7" />
      </g>
    </Place>
  );
}
export function Drill({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <g data-art="drill">
        <path
          d="M-105 35h132a17 17 0 0 1 0 34h-132a17 17 0 0 1 0-34Z"
          fill="#555b50"
        />
        <path d="M-104 43H22m-127 17H22" stroke="#faf8f2" strokeWidth="2" />
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            d={`M${-100 + i * 17} 39v23`}
            stroke="#cacdc1"
            strokeWidth="2"
          />
        ))}
        <path d="M-93 33v-51h63l16 22h46v29Z" fill="#ecebe3" />
        <path d="M-81-17v-42h45v42Z" fill="#eeeee7" />
        <path d="M-75-52h30v27h-30Z" fill="#adb6a6" />
        <path d="M-64-50v25M-85 6h48M-83 16h27" strokeWidth="2" />
        <path d="M20 31 31-215 63-218 53 31Z" fill="#e6e6dc" />
        <path
          d="M32-200 60-174 34-148 57-121 30-94 54-65 28-39 52-13M43-215v248"
          fill="none"
          strokeWidth="2"
        />
        <g data-art="pipe">
          <path d="M68-205v350" strokeWidth="7" />
          <path d="M74-205v350" stroke="#92958b" strokeWidth="2" />
          <path d="m65 140 7 18 5-18Z" fill="#343832" />
        </g>
        <path d="M-21 0 15-38 34-39" fill="none" />
        <path d="M-97 10h8" stroke="#f45b3d" strokeWidth="4" />
      </g>
    </Place>
  );
}
export function Excavator({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <g data-art="excavator">
        <g data-art="tracks">
          <rect
            x="-130"
            y="20"
            width="210"
            height="48"
            rx="24"
            fill="#33382f"
          />
          <rect
            x="-115"
            y="30"
            width="180"
            height="26"
            rx="13"
            fill="#7e8375"
          />
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`m${-108 + i * 20} 28-5 32`}
              stroke="#e6e6dd"
              strokeWidth="2"
            />
          ))}
          <circle cx="-99" cy="44" r="9" fill="#31362e" />
          <circle cx="47" cy="44" r="9" fill="#31362e" />
        </g>
        <path d="M-123 18v-64h100l16 64Z" fill="#dfdfd4" />
        <path d="M-121-31h44m-41 10h28m-28 10h24" strokeWidth="2" />
        <path d="M-21 17-28-81h70l14 98Z" fill="#ecece4" />
        <path d="M-14-68h46l9 48h-51Z" fill="#aeb6a7" />
        <path d="M12-68v48M-14 0h47" />
        <g data-art="arm">
          <path
            d="M39-6 102-150 246-191 334-74 319-60 233-165 122-128 67 4Z"
            fill="#d1d3c7"
          />
          <path
            d="M55-7 112-137 238-178 326-68"
            fill="none"
            stroke="#faf8f2"
            strokeWidth="5"
          />
          <path
            d="M80-37 111-117M151-141 226-163M267-135 305-88"
            strokeWidth="7"
          />
          <path
            d="M80-37 111-117M151-141 226-163M267-135 305-88"
            stroke="#9ba18f"
            strokeWidth="3"
          />
          {[
            [53, -2],
            [115, -137],
            [240, -178],
            [326, -70],
          ].map(([a, b]) => (
            <circle key={a} cx={a} cy={b} r="7" fill="#faf8f2" />
          ))}
          <g data-art="bucket">
            <path
              d="M316-74q47-5 64 22l-16 65-47 9-34-23 18-42Z"
              fill="#6e7665"
            />
            <path
              d="m313-48-14 41 23 17 30-6 12-40M327-53l-9 53m24-45-9 48"
              fill="none"
              stroke="#c7cbbe"
              strokeWidth="2"
            />
            {[305, 319, 333, 347].map((i) => (
              <path key={i} d={`m${i} 10-4 20 10-3 4-19Z`} fill="#dddcd1" />
            ))}
            <path d="M314-70h18v15h-18Z" fill="#f0eee5" />
          </g>
        </g>
        <path d="M-106-49h17" stroke="#f45b3d" strokeWidth="4" />
      </g>
    </Place>
  );
}
export function Truck({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <g data-art="truck">
        <path d="M-147 8h253v36h-253Z" fill="#565d4f" />
        <g data-art="bed">
          <path d="M-162-74h202l28 73h-196Z" fill="#ddded4" />
          <path
            d="m-149-65 37 57m4-57 31 57m9-57 29 57m10-57 25 57M-163-76H50"
            fill="none"
            strokeWidth="3"
          />
          <g data-art="payload">
            <Pile x={-137} y={-81} width={180} rows={2} />
          </g>
        </g>
        <path d="M50-49h73l27 66v32H66Z" fill="#e8e8de" />
        <path d="M59-42h49l17 36H68Z" fill="#aab3a0" />
        <path d="M84-42v34m46 27h16m-16 8h16m-16 8h16" fill="none" />
        <path d="M114 17h31v29h-31Z" fill="#7e8574" />
        <path d="M143 12h12v35h-12Z" fill="#cccfc0" />
        <path d="M80 1h14" strokeWidth="3" />
        {[-102, 44, 113].map((cx) => (
          <g key={cx} transform={`translate(${cx} 47)`}>
            <g data-art="wheels">
              <circle r="31" fill="#292e25" />
              <circle r="19" fill="#c7cbbb" />
              <circle r="9" fill="#596150" />
              <path
                d="M0-25v9M25 0h-9M0 25v-9M-25 0h9"
                stroke="#858d79"
                strokeWidth="3"
              />
            </g>
          </g>
        ))}
        <path d="M75-57h12v8H75Z" fill="#f45b3d" />
      </g>
    </Place>
  );
}
export function Belt({
  x = 0,
  y = 0,
  width = 950,
}: {
  x?: number;
  y?: number;
  width?: number;
}) {
  return (
    <Place x={x} y={y}>
      <path
        d={`M0 0H${width}a16 16 0 0 1 0 32H0a16 16 0 0 1 0-32Z`}
        fill="#30362b"
      />
      <path
        d={`M0 7H${width}M0 26H${width}`}
        stroke="#ecece2"
        strokeWidth="2"
      />
      <path
        data-art="belt-flow"
        d={`M0 3H${width}`}
        stroke="#b9c1ab"
        strokeWidth="2"
        strokeDasharray="12 6"
      />
      {Array.from({ length: Math.floor(width / 75) }, (_, i) => (
        <g key={i}>
          <circle cx={i * 75 + 20} cy="17" r="10" fill="#939a87" />
          <circle cx={i * 75 + 20} cy="17" r="4" fill="#faf8f2" />
          <path
            d={`M${i * 75 + 20} 33v100m0-5 70-80m-70 0 70 80`}
            fill="none"
            strokeWidth="2"
          />
        </g>
      ))}
      <path d={`M0 135H${width}`} strokeWidth="2" />
    </Place>
  );
}
export function Mountains() {
  return (
    <g data-art="far" fill="none" stroke="#b4b6ab" strokeWidth="1.5">
      <path d="M-50 325 62 240 159 286 273 177 383 274 496 224 639 312 807 211 945 285 1082 180 1192 269 1415 228" />
      <path d="m62 240 30 46 37-11m144-98 15 67 33-6m486-27 31 55 33-11m212-75 34 57 28-6" />
      <path d="M65 174q16-23 31-5 8-39 34-31 23 3 28 28 22-10 31 11H65m715-47q20-20 34-1 9-37 34-32 25 4 29 32 17-7 29 6H780" />
    </g>
  );
}
export function MineFace({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <g data-art="ridge" fill="none">
        <path d="M0 455 88 210 192 121 330 86 488 128 613 187 745 159 960 226 1080 447" />
        <path d="M33 389 172 338 408 345 584 299 814 328 1017 363M49 339 205 274 420 280 610 253 809 274 977 301M68 280 236 216 451 224 615 214 817 224 934 252M107 213 290 160 459 179 632 182 797 191" />
        {Array.from({ length: 46 }, (_, i) => {
          const xx = 120 + (i % 13) * 64;
          const yy = 215 + Math.floor(i / 13) * 57;
          return (
            <path
              key={i}
              d={`m${xx} ${yy} 10 24m-3-21 6 8`}
              stroke="#92968a"
              strokeWidth="1.4"
            />
          );
        })}
        <path
          d="M4 455q198-69 419-13t664 6M12 467q216-36 419-10t637 2"
          stroke="#7f8476"
          strokeWidth="1.5"
        />
      </g>
    </Place>
  );
}
export function Plant({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <path
        d="M0 0v-140h110V0M23-140v-95h30v95M76-140v-70h20v70"
        fill="#e4e5da"
      />
      <path
        d="M-30-77h164v25H-30ZM-30-77v-25h164v25M-30-87h164M-12-102v25M16-102v25M44-102v25M72-102v25M100-102v25M126-102v25"
        fill="none"
      />
      <path
        d="M16 0v-53m36 53v-53m36 53v-53M13-140v63m84-63v63M25-219h25m-25 13h25m-25 13h25M80-198h12m-12 12h12"
        strokeWidth="2"
      />
      <path d="M-210 0-18-94l8 18-192 97Z" fill="#c9cebd" />
      <path
        d="m-184 7 13 42m49-75 16 50m49-81 16 56M-183 25l63-43m-10 22 68-46"
        fill="none"
        strokeWidth="2"
      />
      <path d="M110-44 258 8l-8 17-140-49Z" fill="#bfc6b2" />
    </Place>
  );
}
export function Tank({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <Place x={x} y={y} scale={scale}>
      <path d="M-240 0v140q240 113 480 0V0" fill="#e0e2d6" />
      {Array.from({ length: 13 }, (_, i) => (
        <path
          key={i}
          d={`M${-225 + i * 37} 27v${113 + Math.sin((i / 12) * Math.PI) * 35}`}
          stroke="#8e9781"
          strokeWidth="1.8"
        />
      ))}
      <ellipse rx="240" ry="85" fill="#faf8f2" />
      <ellipse rx="228" ry="75" fill="#e5e1d3" />
      <g data-art="bubbles">
        {Array.from({ length: 60 }, (_, i) => {
          const xx = -196 + (i % 12) * 34;
          const yy = -45 + Math.floor(i / 12) * 21;
          return (
            <circle
              data-art={i % 7 === 0 ? "froth-bubble" : undefined}
              key={i}
              cx={xx}
              cy={yy + Math.sin(i) * 9}
              r={8 + (i % 5) * 2.1}
              fill={i % 6 === 0 ? "#f5c4aa" : "#eeede1"}
              strokeWidth="1.5"
            />
          );
        })}
      </g>
      <path
        d="M-263 1q263 113 526 0M-265-28q265 107 530 0M-265-28v37M265-28v37"
        fill="none"
      />
      {[-220, -145, -70, 0, 70, 145, 220].map((i) => (
        <path key={i} d={`M${i} ${52 - Math.abs(i) / 3}v-35`} />
      ))}
      <path d="M-35-4v-170h70V-4" fill="#c3c9b6" />
      <path d="M-35-169h70m-56 8v150m41-151v151" strokeWidth="2" />
      <path
        d="M-240-190h480v20h-480ZM-240-190v-23h480v23M-240-202h480"
        fill="none"
      />
      {Array.from({ length: 13 }, (_, i) => (
        <path key={i} d={`M${-240 + i * 40}-213v23`} />
      ))}
      <Camera x={45} y={-135} scale={0.75} />
    </Place>
  );
}
export function Distribution({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <Place x={x} y={y}>
      <g
        data-art="cv"
        className="cv-layer"
        fill="none"
        stroke="#f45b3d"
        strokeWidth="2"
      >
        <path
          d="M0-110V0h215M0-15h70m-70-40h125M0-86h175"
          strokeDasharray="3 5"
        />
        <path d="M3-4q35-2 53-20t45-21q31-3 48-27t62-31" />
        {[
          [60, -27, "P20"],
          [121, -51, "P50"],
          [176, -88, "P80"],
        ].map(([x1, y1, t]) => (
          <g key={t}>
            <circle cx={x1} cy={y1} r="4" fill="#f45b3d" />
            <text
              x={Number(x1) + 7}
              y={Number(y1) - 10}
              stroke="none"
              fill="#c4472d"
            >
              {t}
            </text>
          </g>
        ))}
        <text x="0" y="-135" fill="#c4472d" stroke="none">
          Size distribution · illustrative
        </text>
        <text x="35" y="26" fill="#73766f" stroke="none">
          fine → coarse
        </text>
      </g>
    </Place>
  );
}
