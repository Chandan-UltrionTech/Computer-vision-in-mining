import {
  Camera,
  Distribution,
  Drill,
  Drone,
  Excavator,
  MineFace,
  Mountains,
  Pile,
  Place,
  Rock,
  Truck,
  Worker,
} from "../../illustrations/Primitives";
import type { SceneId } from "../../core/types";

function CoreTray() {
  return (
    <g data-art="core-tray">
      <path d="M380 375 1110 352 1180 618 339 631Z" fill="#d8dbde" />
      <path
        d="m395 397 696-22 17 45-725 24Zm-17 79 741-25 16 48-767 27Zm-15 79 780-25 16 55-813 27Z"
        fill="#757a81"
      />
      {Array.from({ length: 27 }, (_, i) => {
        const row = Math.floor(i / 9),
          col = i % 9;
        const x = 390 + col * 77 - row * 10;
        const y = 415 + row * 81;
        return (
          <g key={i}>
            <path
              d={`M${x} ${y - 13}q12-13 30-9l36-3 10 32-69 4Z`}
              fill={i % 4 === 0 ? "#b6bbc1" : "#d8dbde"}
              strokeWidth="2"
            />
            <path
              d={`m${x + 31} ${y - 21}-5 15 12 6-7 15m22-33-3 10 5 11m-47-10 5 12`}
              fill="none"
              strokeWidth="1.3"
            />
            {i % 3 === 0 && (
              <path
                d={`m${x + 32} ${y - 22}-7 14 14 7-6 15`}
                data-art="cv"
                className="cv-layer"
                stroke="#f45b3d"
                fill="none"
                strokeWidth="3"
              />
            )}
          </g>
        );
      })}
      <g data-art="cv" className="cv-layer" stroke="#f45b3d" fill="none">
        <path d="M540 380v236M854 367v232" strokeDasharray="7 6" />
        <path d="M870 425q40-10 91 4l17 32q-55 17-109 6Z" />
        <path d="M713 513v-32l-42-41" />
        <text x="579" y="430" fill="#c4472d" stroke="none">
          fracture
        </text>
        <text x="990" y="470" fill="#c4472d" stroke="none">
          vein
        </text>
        <text x="525" y="630" fill="#c4472d" stroke="none">
          lithology boundary
        </text>
        <path data-art="seam" d="M854 602h96" strokeWidth="3" />
      </g>
      <g data-art="scan" stroke="#f45b3d">
        <path d="M415 357v260" strokeWidth="3" />
        <path d="M407 357h16m-16 260h16" />
      </g>
    </g>
  );
}
export function Geology({ id }: { id: SceneId }) {
  if (id === "arrival")
    return (
      <>
        <Mountains />
        <Place x={470} y={105} scale={0.86}>
          <MineFace />
        </Place>
        <path
          d="M-100 680q370-110 660-61t910 39M-10 705q399-92 655-34t820 26"
          fill="none"
          stroke="#95979a"
          strokeWidth="1.5"
        />
        <Place x={630} y={535} scale={0.9}>
          <Excavator />
        </Place>
        <Truck x={1035} y={605} scale={0.73} />
        <Drill x={1290} y={470} scale={0.58} />
        <Pile x={525} y={636} width={335} rows={2} />
        <Worker x={430} y={628} scale={0.8} />
        <Drone x={1150} y={192} scale={0.82} />
        <PlantDistant />
        <path
          d="m315 500q32 56 96 46m-11-15 13 16-20 5"
          fill="none"
          strokeWidth="2"
        />
        <text x="244" y="486" className="hand-note">
          the story starts here
        </text>
      </>
    );
  if (id === "drill")
    return (
      <>
        <Mountains />
        <path
          d="M120 475h1190M120 680h1190M145 578q230-130 466-7t689-45"
          fill="none"
        />
        <path
          d="M120 478h1190v236H120Z"
          fill="url(#geology-hatch)"
          stroke="none"
        />
        <path d="M170 647q290-129 466-42t626-49" fill="none" stroke="#a1a3a6" />
        <Drill x={800} y={440} scale={1.2} />
        <Worker x={575} y={420} scale={0.65} />
        <g data-art="core-rise">
          <path d="M914 647v-170h23v170Z" fill="#c1c3c6" />
          <path d="m915 590 21-12m-21-26 21-7m-21-24 21-11" />
        </g>
        <path d="M420 571h280l54 33" fill="none" stroke="#77797c" />
        <text x="280" y="578">
          geological layers
        </text>
        <text x="830" y="682">
          cutaway through the bench
        </text>
      </>
    );
  if (id === "core")
    return (
      <>
        <Worker x={240} y={560} scale={1.25} />
        <path d="m272 480 66-67 38 31-68 73Z" fill="#d7d9dc" />
        <CoreTray />
        <Camera x={505} y={330} scale={0.85} />
        <path d="M250 656H1240" fill="none" stroke="#a3a5a8" />
        <text x="372" y="675">
          from the bench → to the core tray
        </text>
      </>
    );
  if (id === "grade")
    return (
      <>
        <Mountains />
        <MineFace x={220} y={142} scale={0.99} />
        <Drone x={550} y={230} />
        <g
          data-art="cv"
          className="cv-layer"
          stroke="#f45b3d"
          fill="#f9dfcf"
          fillOpacity=".6"
        >
          <path d="M402 472 513 371 688 329 777 395 714 559 551 588 440 552Z" />
          <path
            d="M689 330 817 320 1026 393 1097 502 890 549 713 561Z"
            fill="#b3b5b8"
          />
          <path
            d="m402 472 148 39 137-182M550 511l162 50m-162-50 2 77"
            fill="none"
            strokeDasharray="5 7"
          />
          <text x="532" y="467" fill="#b63c27" stroke="none">
            ore region
          </text>
          <text x="869" y="440" fill="#414346" stroke="none">
            waste region
          </text>
          <text x="692" y="629" fill="#b63c27" stroke="none">
            grade proxies require site calibration
          </text>
        </g>
        <path
          data-art="scan"
          d="M356 300v320"
          stroke="#f45b3d"
          strokeWidth="3"
        />
        <Truck x={1120} y={640} scale={0.44} />
      </>
    );
  if (id === "blast")
    return (
      <>
        <Mountains />
        <MineFace x={295} y={50} />
        <path d="M350 545h790" fill="none" strokeWidth="2" />
        {[430, 570, 710, 850, 990].map((x) => (
          <g key={x}>
            <path d={`M${x} 545v80`} strokeWidth="7" />
            <path d={`m${x - 6} 535h12v12h-12Z`} fill="#c4c6c9" />
            <path d={`M${x} 535q-35-25-71 0`} fill="none" strokeWidth="2" />
          </g>
        ))}
        <path d="M430 535Q310 480 223 641" fill="none" strokeWidth="2" />
        <g data-art="blast-cloud">
          <path
            d="m477 570 41-137 43 53 26-153 59 138 42-184 33 172 88-134-29 172 110-66-65 142 109-11-97 86Z"
            fill="#f8b69a"
            stroke="#f45b3d"
            strokeWidth="3"
          />
          <path
            d="m576 578 63-131 24 71 52-91 10 118 67-54-30 83"
            fill="none"
            stroke="#faf8f2"
            strokeWidth="8"
          />
          <g data-art="debris">
            {Array.from({ length: 13 }, (_, i) => (
              <Rock
                key={i}
                x={470 + i * 46}
                y={Number((520 - Math.sin((i / 12) * Math.PI) * 140).toFixed(2))}
                size={0.6 + (i % 3) * 0.3}
              />
            ))}
          </g>
          <path
            d="m434 460-19-29m340-73 11-36m241 154 38-14m-158-99 23-20"
            fill="none"
          />
        </g>
        <Pile x={422} y={639} width={700} rows={1} />
        <text x="530" y="680">
          blast holes → connected charges → broken rock
        </text>
      </>
    );
  return (
    <>
      <Mountains />
      <MineFace x={650} y={20} scale={0.6} />
      <Pile x={155} y={625} width={1050} rows={5} />
      <Camera x={1015} y={360} />
      <g data-art="cv" className="cv-layer" stroke="#f45b3d" fill="none">
        {Array.from({ length: 25 }, (_, i) => (
          <path
            key={i}
            d={`m${194 + (i % 10) * 83} ${596 - Math.floor(i / 10) * 51} 11-25 24-8 28 14 9 29-46 7Z`}
            strokeWidth="2"
          />
        ))}
        <path d="M295 657h96m-96-7v14m96-14v14" />
        <text x="283" y="689" fill="#c4472d" stroke="none">
          fragment span
        </text>
      </g>
      <Distribution x={990} y={475} />
      <Excavator x={755} y={528} scale={1.05} />
    </>
  );
}
function PlantDistant() {
  return (
    <g
      transform="translate(1090 430) scale(.36)"
      fill="none"
      stroke="#727477"
      strokeWidth="3"
    >
      <path d="M0 0v-180h90V0M15-180v-80h20v80M-130 0l120-90 8 15-120 90M-100-13v60m50-90v50M90-60 170-20" />
      <path d="M-10-120h110v20H-10Z" />
    </g>
  );
}
