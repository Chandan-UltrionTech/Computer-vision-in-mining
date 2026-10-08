"use client";
import { useRef } from "react";
import type { SceneDefinition } from "../core/types";
import { partNames } from "../core/sceneRegistry";
import { gsap, useGSAP } from "../core/gsap";
import { useExperience } from "../store/experienceStore";
import { Geology } from "./part-1/Geology";
import { Material } from "./part-2/Material";
import { Recovery } from "./part-3/Recovery";
import { Environment } from "../illustrations/Environment";
import styles from "../styles/Journey.module.css";

export function Scene({ definition: s }: { definition: SceneDefinition }) {
  const ref = useRef<HTMLElement>(null);
  const advanceRef = useRef<gsap.core.Tween | null>(null);
  const removeListenersRef = useRef<(() => void) | null>(null);
  const detonated = useExperience((v) => v.detonated);
  const { contextSafe } = useGSAP(() => () => {
    advanceRef.current?.kill();
    removeListenersRef.current?.();
  }, { scope: ref });
  function blast() {
    contextSafe(() => {
      advanceRef.current?.kill();
      removeListenersRef.current?.();
      useExperience.getState().detonate();
      if (
        !ref.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const chapters = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-chapter]'));
      const index = chapters.findIndex(chapter => chapter.dataset.scrollChapter === 'blast');
      const start = chapters.slice(0,index).reduce((sum,chapter) => sum + chapter.offsetHeight,0);
      if (detonated) window.scrollTo({top:start + chapters[index].offsetHeight * .35,behavior:'instant'});
      const cursor = {y:window.scrollY};
      // The button advances the scroll clock. Only the controller animates blast art.
      const advance = gsap.to(cursor,{
        y:start + chapters[index].offsetHeight * .7,
        duration:1.15,ease:'power2.inOut',
        onUpdate:() => window.scrollTo({top:cursor.y,behavior:'instant'}),
        onComplete:removeListeners,
      });
      advanceRef.current = advance;
      removeListenersRef.current = removeListeners;
      function interrupt(){advance.kill();removeListeners();}
      function removeListeners(){window.removeEventListener('wheel',interrupt);window.removeEventListener('touchstart',interrupt);}
      window.addEventListener('wheel',interrupt,{passive:true});
      window.addEventListener('touchstart',interrupt,{passive:true});
    })();
  }
  const mobileNotes: Partial<Record<SceneDefinition['id'], string>> = {
    drill:'A core rises through the geological layers.', core:'Fractures / veins / lithology', grade:'Material regions, grounded in site calibration',
    fragments:'Contours become a size distribution.', safety:'Worker tracking / PPE / closing distance', bucket:'Tooth condition / oversize / loading decision',
    driver:'Eye closure and head pose, observed over time', conveyor:'Foreign object / downstream risk / belt response', sizing:'Particle contours / spans / P20, P50, P80',
    sorter:'Accepted material continues. Rejects leave the stream.', froth:'Bubble motion / texture / stability over time',
    survey:'Overlapping images / points / mesh / volume', thermal:'RGB context / thermal reveal / inspection target',
  };
  const art =
    s.part === 1 ? (
      <Geology id={s.id} />
    ) : s.part === 2 ? (
      <Material id={s.id} />
    ) : (
      <Recovery id={s.id} />
    );
  return (
    <section
      ref={ref}
      className={styles.scene}
      data-scene={s.id}
      aria-labelledby={`${s.id}-title`}
    >
      <div className={styles.title} data-art="title">
        <div className={styles.part}>
          <span>Part {["I", "II", "III"][s.part - 1]}</span>
          <span>{partNames[s.part - 1]}</span>
        </div>
        {s.id === "arrival" ? (
          <h1 id={`${s.id}-title`}>{s.title}</h1>
        ) : (
          <h2 id={`${s.id}-title`}>{s.title}</h2>
        )}
        <p>{s.subtitle}</p>
      </div>
      <div className={styles.art}>
        <svg
          viewBox="0 0 1400 790"
          fill="none"
          stroke="#17191c"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={`geology-${s.id}`}
              width="35"
              height="35"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="m0 35 35-35M-10 10 10-10M25 45l20-20"
                stroke="#c4c6c9"
                strokeWidth="1"
              />
            </pattern>
            <pattern
              id={s.id === "drill" ? "geology-hatch" : `hatch-${s.id}`}
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path d="m0 30 30-30" stroke="#d3d5d8" strokeWidth="1" />
            </pattern>
          </defs>
          <g data-art="camera-frame"><g data-art="world"><Environment id={s.id}/>{art}</g></g>
        </svg>
      </div>
      {mobileNotes[s.id] && <div className={styles.mobileNote}>{mobileNotes[s.id]}</div>}
      {s.id === "arrival" && (
        <div className={styles.introBottom}>
          <span className={styles.scrollMark}>↓</span>
          <div>
            <strong>Scroll to enter the mine</strong>
            <br />
            <span>One continuous journey, from rock to recovery.</span>
          </div>
        </div>
      )}
      {s.id === "blast" && (
        <button
          type="button"
          className={styles.detonator}
          onClick={blast}
          aria-pressed={detonated}
          aria-label={
            detonated ? "Replay illustrated blast" : "Push detonator to blast"
          }
        >
          <svg
            viewBox="0 0 100 125"
            fill="none"
            stroke="#20221f"
            strokeWidth="3"
            aria-hidden="true"
          >
            <path d="M16 54h68v64H16Z" fill="#dee0e3" />
            <path d="M24 62h52v47H24Z" strokeWidth="1.5" />
            <path d="M32 84h36m-30 10h25" />
            <g data-handle="true">
              <path d="M44 52V21h12v31" fill="#65676a" />
              <path d="M13 10h74v14H13Z" fill="#f45b3d" />
            </g>
            <path d="M35 72h30" stroke="#f45b3d" />
          </svg>
          <span>
            {detonated ? "Blast triggered · replay" : "Push to blast ↓"}
          </span>
        </button>
      )}
      {s.id === "finale" && (
        <div className={styles.thesis}>
          <span data-art="final-line-1">The mine never stopped moving.</span>
          <span data-art="final-line-2">
            Computer Vision never lived in one camera.
          </span>
          <span data-art="final-line-3">
            It became an intelligence layer across the operation.
          </span>
        </div>
      )}
      <div className={styles.reducedCopy}>
        {s.capability ? (
          <>
            <strong>{String(s.capability.number).padStart(2, "0")} · {s.capability.name}</strong>
            <p>{s.capability.problem}</p>
            <p>{s.capability.explanation}</p>
            <p>{s.capability.result}</p>
          </>
        ) : (
          <p>
            {s.id === "finale"
              ? "The mine never stopped moving. Computer Vision became an intelligence layer across the operation. Use the CV layer switch to compare the physical operation with its observations."
              : s.subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
