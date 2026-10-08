"use client";
import { useRef } from "react";
import { useGSAP } from "./core/gsap";
import { JourneyController } from "./core/JourneyController";
import { sceneRegistry } from "./core/sceneRegistry";
import { useExperience } from "./store/experienceStore";
import { ExperienceHUD } from "./hud/ExperienceHUD";
import { Scene } from "./scenes/Scene";
import { Deployment } from "@/components/Deployment";
import { PhysicalHandoff } from "./transitions/PhysicalHandoff";
import styles from "./styles/Journey.module.css";

export function MiningJourney() {
  const root = useRef<HTMLDivElement>(null);
  const cvEnabled = useExperience((s) => s.cvEnabled);
  useGSAP(
    () => {
      if (root.current) return new JourneyController(root.current).mount();
    },
    { scope: root },
  );
  return (
    <>
      <a href="#deployment" className="skip-link">
        Skip the animated journey
      </a>
      <ExperienceHUD />
      <main>
        <div
          ref={root}
          className={styles.journey}
          data-cv={cvEnabled ? "on" : "off"}
          id="mine"
        >
          <div className={styles.viewport}>
            <div className={styles.panels}>
              {sceneRegistry.map((definition) => (
                <Scene key={definition.id} definition={definition} />
              ))}
            </div>
            <PhysicalHandoff />
          </div>
          <div className={styles.chapters} aria-hidden="true">
            {sceneRegistry.map((s) => (
              <div
                key={s.id}
                id={`chapter-${s.id}`}
                data-scroll-chapter={s.id}
              />
            ))}
          </div>
        </div>
        <Deployment />
      </main>
    </>
  );
}
