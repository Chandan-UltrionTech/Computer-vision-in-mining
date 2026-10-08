"use client";
import { useRef } from "react";
import type { SceneDefinition } from "../core/types";
import { partNames } from "../core/sceneRegistry";
import { gsap, useGSAP } from "../core/gsap";
import { useExperience } from "../store/experienceStore";
import { Geology } from "./part-1/Geology";
import { Material } from "./part-2/Material";
import { Recovery } from "./part-3/Recovery";
import styles from "../styles/Journey.module.css";

export function Scene({ definition: s }: { definition: SceneDefinition }) {
  const ref = useRef<HTMLElement>(null);
  const detonated = useExperience((v) => v.detonated);
  const { contextSafe } = useGSAP({ scope: ref });
  function blast() {
    contextSafe(() => {
      useExperience.getState().detonate();
      if (
        !ref.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const cloud = ref.current.querySelector("[data-art=blast-cloud]");
      const debris = ref.current.querySelector("[data-art=debris]");
      gsap
        .timeline()
        .fromTo(
          cloud,
          { opacity: 0, scale: 0.1 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            transformOrigin: "50% 100%",
            ease: "power3.out",
          },
        )
        .fromTo(
          debris,
          { y: 0, x: 0 },
          { y: -95, x: 50, duration: 0.6, ease: "power2.out" },
          0.16,
        )
        .to(debris, { y: 25, duration: 0.65, ease: "power2.in" });
    })();
  }
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
          stroke="#272c23"
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
                stroke="#c6ccbb"
                strokeWidth="1"
              />
            </pattern>
            <pattern
              id={s.id === "drill" ? "geology-hatch" : `hatch-${s.id}`}
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path d="m0 30 30-30" stroke="#d5d9cb" strokeWidth="1" />
            </pattern>
          </defs>
          <g data-art="world">{art}</g>
        </svg>
      </div>
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
            <path d="M16 54h68v64H16Z" fill="#e1e3d7" />
            <path d="M24 62h52v47H24Z" strokeWidth="1.5" />
            <path d="M32 84h36m-30 10h25" />
            <g data-handle="true">
              <path d="M44 52V21h12v31" fill="#666e5c" />
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
            <strong>{s.capability.name}</strong>
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
