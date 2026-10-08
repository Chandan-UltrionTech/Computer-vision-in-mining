import type { SceneId } from "../../core/types";
import {
  Belt,
  Camera,
  Distribution,
  Excavator,
  MineFace,
  Mountains,
  Pile,
  Plant,
  Rock,
  Truck,
  Worker,
} from "../../illustrations/Primitives";

function ExcavationWorld() {
  return (
    <>
      <Mountains />
      <MineFace x={650} y={20} scale={0.6} />
      <Pile x={825} y={644} width={470} rows={3} />
      <Excavator x={755} y={528} scale={1.05} />
      <Truck x={415} y={621} scale={0.8} />
      <Worker x={420} y={493} scale={0.75} />
      <path d="M130 692q430-54 1110-1" fill="none" stroke="#a0a895" />
    </>
  );
}
function BeltWorld() {
  return (
    <>
      <Mountains />
      <Plant x={1170} y={485} scale={0.53} />
      <Belt x={100} y={580} width={1190} />
      <g data-art="belt-material">
        {Array.from({ length: 17 }, (_, i) => (
          <Rock
            key={i}
            x={105 + i * 63}
            y={551 - (i % 3) * 7}
            size={0.6 + (i % 4) * 0.23}
          />
        ))}
      </g>
      <Camera x={823} y={422} scale={1.1} />
    </>
  );
}
function Cab() {
  return (
    <>
      <path d="M180 388q460-122 1030 0l91 201H111Z" fill="#e2e5d8" />
      <path d="M210 396q375-106 851-24l93 166H157Z" fill="#faf8f2" />
      <path
        d="M541 531 739 382l177 159M580 530l124-105m83 5 87 101"
        fill="none"
        stroke="#8e9880"
      />
      <path
        d="m245 429 72-19 75 17m-48 64 64-21 63 17m434-81 97 34"
        fill="none"
        stroke="#c0c6b4"
      />
      <path d="M180 388 144 616M1193 380l105 231" strokeWidth="15" />
      <path d="M121 562q555-62 1175 0v131H121Z" fill="#8a9480" />
      <path d="M231 605h374v41H231Z" fill="#d3d9c9" />
      {[260, 325, 390, 455, 520].map((x) => (
        <circle key={x} cx={x} cy="627" r="12" fill="#faf8f2" />
      ))}
      <path d="M908 709v-158q18-60 102-60t95 60v158Z" fill="#414a36" />
      <path d="M920 694v-154q96-92 170 0v154" fill="#c5cdba" />
      <g data-art="head">
        <path
          d="M973 443q-22-59 22-73 48-8 61 47l-6 31-28 20-20-5Z"
          fill="#efeee3"
        />
        <path
          d="M969 397q-6-52 32-46 44-6 56 43l-26-14-25 18Z"
          fill="#464e3b"
        />
        <path d="m1018 412 10 18-14 6m-5 13 17 2" fill="none" strokeWidth="2" />
        <g data-art="eyelids">
          <path d="m986 413 15-2m31-2 13 3" strokeWidth="3" />
        </g>
      </g>
      <path
        d="m973 475-40 35-45 61m158-90 20 56-74 19"
        fill="none"
        stroke="#e8e8dd"
        strokeWidth="18"
      />
      <ellipse cx="882" cy="597" rx="93" ry="31" fill="none" strokeWidth="13" />
      <path d="M882 581v43m-76-25 77 8 79-14" fill="none" strokeWidth="7" />
      <path d="M704 570h92v69h-92Z" fill="#eceee2" />
      <g data-art="cv" className="cv-layer" fill="none" stroke="#f45b3d">
        <path d="M990 411h48l-20 22-11 15 17 3M1018 431l-12-20" />
        {[
          [990, 411],
          [1038, 411],
          [1018, 433],
          [1007, 449],
          [1024, 451],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="4" fill="#f45b3d" />
        ))}
        <path d="M710 632h80l-40-52Z" />
        <text x="745" y="622" stroke="none" fill="#c4472d">
          !
        </text>
        <text x="1073" y="419" stroke="none" fill="#c4472d">
          eye closure
        </text>
        <text x="1073" y="448" stroke="none" fill="#c4472d">
          head pose
        </text>
        <path d="M1055 450h15M1058 415h12" />
      </g>
      <Camera x={580} y={380} scale={0.6} />
      <text x="240" y="725">
        time, repetition, attention
      </text>
    </>
  );
}
export function Material({ id }: { id: SceneId }) {
  if (["excavation", "safety", "loading"].includes(id))
    return (
      <>
        <ExcavationWorld />
        {id === "safety" && (
          <g data-art="cv" className="cv-layer" stroke="#f45b3d" fill="none">
            <ellipse cx="817" cy="596" rx="260" ry="65" strokeDasharray="8 9" />
            <path d="M394 409h57v141h-57ZM467 496h246m-246-6v12m246-12v12" />
            <text x="485" y="479" fill="#c4472d" stroke="none">
              closing distance · illustrative
            </text>
            <text x="352" y="389" fill="#c4472d" stroke="none">
              helmet ✓ · vest ✓
            </text>
            <text x="748" y="674" fill="#c4472d" stroke="none">
              exclusion boundary
            </text>
          </g>
        )}
        {id === "loading" && (
          <g data-art="load-rocks">
            <Rock x={615} y={465} />
            <Rock x={658} y={439} size={0.8} />
            <Rock x={705} y={467} size={1.2} />
          </g>
        )}
      </>
    );
  if (id === "bucket")
    return (
      <>
        <Mountains />
        <Pile x={800} y={660} width={460} rows={3} />
        <g data-art="bucket-close">
          <path
            d="M375 365q249-100 449-21l-55 209-290 67-152-127Z"
            fill="#777e6d"
          />
          <path
            d="M396 386q190-75 405-19l-48 169-264 59-116-112Z"
            fill="#9ea58f"
          />
          <path
            d="m405 395 70 181m-3-198 65 191m5-204 56 190m15-203 35 187m38-200 13 184"
            fill="none"
            stroke="#d9ddce"
            strokeWidth="4"
          />
          {[421, 488, 554, 688, 754].map((x) => (
            <path key={x} d={`m${x} 570-12 65 30 12 20-64Z`} fill="#dbddcf" />
          ))}
          <path d="m617 568-7 17 24 6 9-16Z" fill="#595e51" />
          <Rock x={615} y={426} size={2.5} />
          <g data-art="good-load">
            <Rock x={425} y={444} />
            <Rock x={768} y={418} size={1.2} />
          </g>
        </g>
        <Camera x={1015} y={410} />
        <g data-art="cv" className="cv-layer" fill="none" stroke="#f45b3d">
          <path d="M549 389 560 352 611 341 671 364 690 420 665 479 575 482 548 440Z" />
          <path d="M603 566h52v51h-52Z" strokeDasharray="4 5" />
          <path d="M630 612v62h171M687 427h196l32-38" />
          <text x="810" y="678" fill="#c4472d" stroke="none">
            abnormal tooth geometry
          </text>
          <text x="921" y="387" fill="#c4472d" stroke="none">
            oversize boulder
          </text>
          {[438, 505, 571, 705, 771].map((x) => (
            <text key={x} x={x} y="678" fill="#c4472d" stroke="none">
              ✓
            </text>
          ))}
        </g>
      </>
    );
  if (id === "haul")
    return (
      <>
        <g data-art="roadscape">
          <Mountains />
          <MineFace x={650} y={-10} scale={0.72} />
          <path
            d="M-190 693Q130 492 553 576t1080-1M-180 737Q200 565 600 623t1040-15"
            fill="none"
            stroke="#878f79"
            strokeWidth="3"
          />
          <path
            d="M-180 716Q150 530 570 600t1080-1"
            stroke="#b4bd9f"
            strokeDasharray="35 24"
            fill="none"
          />
          <Truck x={1160} y={489} scale={0.38} />
          <Plant x={1430} y={540} scale={0.8} />
          <path d="M414 576v-63l-22-35-25 35h46" fill="none" />
          <text x="365" y="551">
            slow
          </text>
        </g>
        <Truck x={720} y={575} scale={1.35} />
      </>
    );
  if (id === "driver") return <Cab />;
  if (id === "crusher")
    return (
      <>
        <Mountains />
        <Plant x={1178} y={472} scale={0.7} />
        <Truck x={448} y={373} scale={1.1} />
        <path d="M642 417h345l-66 113H707Z" fill="#bdc5ad" />
        <path d="M707 530v132h214V530" fill="#535f46" />
        <g data-art="jaw-left">
          <path
            d="M696 534 773 551 752 569 786 590 753 607 784 626 720 661Z"
            fill="#c8ceba"
          />
        </g>
        <g data-art="jaw-right">
          <path
            d="M930 536 853 551 874 569 840 590 873 607 842 626 911 661Z"
            fill="#c8ceba"
          />
        </g>
        <g data-art="crusher-rock">
          <Rock x={812} y={437} size={2} />
        </g>
        <g data-art="crushed">
          <Rock x={795} y={610} size={0.5} />
          <Rock x={828} y={593} size={0.65} />
          <Rock x={853} y={620} size={0.4} />
        </g>
        <Belt x={626} y={710} width={622} />
        <path d="M579 362h61l67 104" fill="none" strokeDasharray="6 7" />
        <text x="363" y="708">
          large fragments → smaller feed
        </text>
      </>
    );
  if (id === "conveyor")
    return (
      <>
        <BeltWorld />
        <path
          d="M335 379v-42h301v42M349 337v-24h271v24M349 322h271"
          fill="none"
        />
        <path
          d="M365 313v25m38-25v25m38-25v25m38-25v25m38-25v25m38-25v25m38-25v25"
          strokeWidth="2"
        />
        <path d="M633 330h37" fill="none" strokeWidth="1.5" />
        <text x="680" y="335">
          maintenance gantry
        </text>
        <g data-art="tool">
          <path
            d="m605 545-39-21q-13 5-23-5l-7-14 12 3 9 9 11-13-5-11-10-8q23-5 32 18l39 24 9-4 8 8-2 15-13 3-8-9Z"
            fill="#8e9781"
            strokeWidth="3"
          />
        </g>
        <g data-art="cv" className="cv-layer" stroke="#f45b3d" fill="none">
          <g data-art="detection">
            <path d="M528 476h99v86h-99Z" strokeDasharray="185 9" />
            <text x="533" y="442" fill="#c4472d" stroke="none">
              foreign object
            </text>
          </g>
          <path d="M703 505h376m-376-6v12m376-12v12" strokeDasharray="4 5" />
          <text x="916" y="486" stroke="none" fill="#c4472d">
            toward crusher
          </text>
          <path d="M1189 384h22v25h-22Z" fill="#f45b3d" />
          <text x="1050" y="365" stroke="none" fill="#c4472d">
            operator alert / belt stop
          </text>
        </g>
        <Worker x={686} y={512} scale={0.64} />
        <g data-art="operator-arm">
          <path d="M684 482 663 500 617 519" fill="none" strokeWidth="8" />
        </g>
      </>
    );
  return (
    <>
      <BeltWorld />
      <g data-art="cv" className="cv-layer" stroke="#f45b3d" fill="none">
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i}>
            <path d={`m${220 + i * 80} 548 8-30 22-9 28 20 5 29-45 4Z`} />
            <path d={`M${226 + i * 80} 486h49m-49-5v10m49-10v10`} />
          </g>
        ))}
        <text x="226" y="470" fill="#c4472d" stroke="none">
          particle spans · calibrated imagery
        </text>
        <path d="M397 539 555 427 814 376" strokeDasharray="3 7" />
        <text x="169" y="670" fill="#c4472d" stroke="none">
          blast distribution → process distribution
        </text>
      </g>
      <Distribution x={1010} y={376} />
    </>
  );
}
