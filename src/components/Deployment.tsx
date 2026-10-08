"use client";
import { useState, useRef } from "react";
import {
  Belt,
  Camera,
  Pile,
  Rock,
} from "@/experience/illustrations/Primitives";
import styles from "./Deployment.module.css";
import { capabilities } from "@/experience/core/sceneRegistry";
const workflows = [
  {
    name: "Conveyor Material Vision",
    brief:
      "Start with a fixed camera. Detect foreign objects and oversize, then extend the same material view to particle sizing.",
    data: "Representative belt video across material types, lighting, dust and belt speed.",
    review:
      "Review false alarms, missed hazards and calibrated particle measurements.",
  },
  {
    name: "Blast Fragmentation Intelligence",
    brief:
      "Use calibrated muckpile imagery to understand fragmentation and bring feedback into the next blast.",
    data: "Calibrated post-blast imagery with reference scale and independent size checks.",
    review:
      "Compare fragment contours and distribution estimates with site measurements.",
  },
  {
    name: "Drill-Core Vision",
    brief:
      "Turn core photographs into fracture, discing and geological observations that can be reviewed at scale.",
    data: "Consistent core-tray imagery, depth intervals and geologist-reviewed labels.",
    review:
      "Compare fracture and lithology observations against geological logging.",
  },
];
export function Deployment() {
  const [workflow, setWorkflow] = useState(workflows[0].name),
    [site, setSite] = useState(""),
    [question, setQuestion] = useState(""),
    [plan, setPlan] = useState(false);
  const planner = useRef<HTMLDivElement>(null);
  const selected = workflows.find((w) => w.name === workflow)!;
  function choose(name: string) {
    setWorkflow(name);
    setPlan(false);
    planner.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }
  function download() {
    const content = `MINING CV PILOT BRIEF\n\nWorkflow: ${workflow}\nSite: ${site || "To be defined by the site team"}\nOperational question: ${question || selected.brief}\n\n1. Collect: ${selected.data}\n2. Validate offline: ${selected.review}\n3. Run in shadow mode with no equipment control.\n4. Review events with site operators and agree thresholds.\n5. Integrate approved alerts and control interfaces under site procedures.\n\nCamera / sensor → edge compute → preprocess → CV model → decision engine → backend → operator / PLC\n\nIllustrated experience; no production model, performance guarantee or live mine data.\n`;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "mining-cv-pilot-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className={styles.section} id="deployment">
      <div className={styles.lead}>
        <span className={styles.label}>
          The journey becomes a practical starting point.
        </span>
        <h2>
          Start with one workflow.
          <br />
          Prove it on site.
        </h2>
        <p>
          We followed the rock through one connected operation. The next step is
          a focused pilot, grounded in the material, cameras and decisions of a
          real mine.
        </p>
      </div>
      <div
        className={styles.summary}
        aria-label="The connected mining lifecycle"
      >
        {[
          ["Understand", "Drill-core analysis", "Ore / waste & grade mapping"],
          ["Break", "Blast fragmentation", "Feedback for the next bench"],
          [
            "Move",
            "PPE & proximity · bucket condition",
            "Driver attention · conveyor hazards · particle sizing",
          ],
          [
            "Process",
            "Optical / laser ore sorting",
            "Flotation froth monitoring",
          ],
          [
            "See the whole site",
            "3D survey & void geometry",
            "Thermal + visual inspection",
          ],
        ].map(([title, ...items]) => (
          <div key={title}>
            <h3>{title}</h3>
            {items.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        ))}
      </div>
      <details className={styles.transcript}>
        <summary>
          Read the intelligence layer, from geology to inspection
        </summary>
        <div>
          {Object.values(capabilities).map((cap) => (
            <article key={cap.name}>
              <h3>{String(cap.number).padStart(2, "0")} · {cap.name}</h3>
              <p>{cap.problem}</p>
              <p>{cap.explanation}</p>
              <p>{cap.result}</p>
            </article>
          ))}
        </div>
      </details>
      <h3 className={styles.pipelineTitle}>
        Three software-first opportunities
      </h3>
      <div className={styles.opportunities}>
        {workflows.map((w, i) => (
          <article className={styles.opportunity} key={w.name}>
            <svg
              viewBox="0 0 420 180"
              fill="none"
              stroke="#20221f"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M4 79 50 56 92 64 134 43 188 63 247 54 309 77 360 45 416 63M3 163q103-15 198-2t214-2" stroke="#a4a9b0" strokeWidth="1.2" />
              {i === 0 ? (
                <>
                  <Belt x={20} y={105} width={370} />
                  <Pile x={30} y={82} width={280} rows={1} />
                  <Camera x={275} y={79} scale={0.6} />
                  <path d="M140 61h54v52h-54m0-41h8m39-11v8m7 36h-8m-46 8v-8" stroke="#f45b3d" strokeWidth="2" />
                </>
              ) : i === 1 ? (
                <>
                  <Pile x={50} y={145} width={310} rows={3} />
                  <path
                    d="m160 80 12-45 18 28 20-61 21 65 34-44-9 53"
                    stroke="#f45b3d"
                    fill="#f8c7af"
                  />
                  <g stroke="#f45b3d" strokeWidth="1.6"><path d="M87 119h56v40H87Zm122-17h69v55h-69Z" /><path d="M323 55v46m-6-46h12m-12 46h12" /><text x="286" y="41" stroke="none" fill="#c4472d" fontSize="11">size / distribution</text></g>
                  <Rock x={89} y={74} size={.4} variant={2} /><Rock x={272} y={55} size={.35} variant={4} />
                </>
              ) : (
                <>
                  <path d="M40 60h332l-18 103H28Z" fill="#d8dbde" strokeWidth="3" />
                  {[0,1,2].map(row=><g key={row} transform={`translate(0 ${row*28})`}><path d="M47 69h307l-4 20H44Z" fill="#747b84" />{[0,1,2,3,4,5,6].map(col=><g key={col}><path d={`M${50+col*42} 69h32v19h-32Z`} fill={col%3===0?'#d7dadd':'#b1b6bd'} strokeWidth="1.3" /><ellipse cx={50+col*42} cy="78.5" rx="4" ry="9.5" fill="#e2e4e6" strokeWidth="1.3" /><path d={`m${64+col*42} 71 3 5-5 7 4 3`} stroke={col%2===0?'#f45b3d':'#777e87'} strokeWidth="2" /></g>)}</g>)}
                  <path d="M58 51h75v18m0-18h27m-102 0v-15" stroke="#f45b3d" strokeDasharray="4 4" /><text x="56" y="30" fontSize="12" stroke="none" fill="#c4472d">fracture / vein / boundary</text>
                </>
              )}
            </svg>
            <span className={styles.opportunityNumber}>0{i+1} / Pilot workflow</span>
            <h3>{w.name}</h3>
            <p>{w.brief}</p>
            <button onClick={() => choose(w.name)}>Explore this pilot ↗</button>
          </article>
        ))}
      </div>
      <h3 className={styles.pipelineTitle}>
        From image to operational decision
      </h3>
      <div className={styles.pipeline} aria-label="Production architecture">
        {[
          "Camera / sensor",
          "Edge compute",
          "Preprocess",
          "CV model",
          "Decision engine",
          "Backend",
          "Operator / PLC",
        ]
          .map((name, i) => (
            <span key={name}>
              {name}
              {i < 6 && <span className="sr-only"> then </span>}
            </span>
          ))
          .flatMap((node, i) =>
            i < 6
              ? [
                  node,
                  <i key={`arrow${i}`} aria-hidden="true">
                    →
                  </i>,
                ]
              : [node],
          )}
      </div>
      <h3 className={styles.pipelineTitle}>A rollout path that earns trust</h3>
      <ol className={styles.path}>
        {[
          ["Collect", "Representative footage from the site's own cameras."],
          ["Validate offline", "Measured against people and site checks."],
          ["Shadow mode", "Runs alongside operations with no control."],
          ["Review", "Operators agree what an event is and when to act."],
          ["Integrate", "Approved alerts connect under site procedures."],
        ].map(([step, detail]) => (
          <li key={step}>
            <strong>{step}</strong>
            <span>{detail}</span>
          </li>
        ))}
      </ol>
      <div ref={planner} className={styles.planner} id="pilot">
        <h3>Design a mining-CV pilot.</h3>
        <p>
          Choose one workflow and the operational question it should answer.
          Build a brief to take into a site discussion.
        </p>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            setPlan(true);
          }}
        >
          <label>
            Workflow
            <select
              value={workflow}
              onChange={(e) => {
                setWorkflow(e.target.value);
                setPlan(false);
              }}
            >
              {workflows.map((w) => (
                <option key={w.name}>{w.name}</option>
              ))}
            </select>
          </label>
          <label>
            Site or operation (optional)
            <input
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder="Your mine or processing site"
              maxLength={150}
            />
          </label>
          <label className={styles.wide}>
            What decision should this support? (optional)
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="For example: identify foreign objects before the primary crusher."
              maxLength={1200}
            />
          </label>
          <div className={styles.wide}>
            <button className={styles.action} type="submit">
              Build the pilot brief
            </button>
          </div>
        </form>
        {plan && (
          <div className={styles.plan} role="status">
            <h4>
              {workflow}
              {site ? ` at ${site}` : ""}
            </h4>
            {question && <p>{question}</p>}
            <ol>
              <li>Collect: {selected.data}</li>
              <li>Validate offline: {selected.review}</li>
              <li>Run in shadow mode. Observe without equipment control.</li>
              <li>
                Review with operators. Agree event definitions and thresholds.
              </li>
              <li>
                Integrate approved alerts and interfaces under site procedures.
              </li>
            </ol>
            <p>Your brief stays in this browser. Nothing is submitted.</p>
            <button className={styles.action} onClick={download}>
              Download pilot brief
            </button>
          </div>
        )}
      </div>
      <div className={styles.thesis}>
        <svg viewBox="0 0 90 54" fill="none" stroke="#202227" strokeWidth="2" aria-hidden="true"><path d="M2 45 19 27 31 32 43 8 60 25 72 17 88 45M5 48h79M43 8l-3 19 20-2" /><circle cx="43" cy="8" r="4" fill="#f97832" /><path d="m43 11-13 23m13-23 18 27m-31-4 31 4" stroke="#f45b3d" strokeDasharray="3 4" /></svg>
        <p>Start with one camera and one decision.<br /><strong>Let the same layer grow across the site.</strong></p>
      </div>
      <footer className={styles.footer}>
        <span>Ultrion · Computer Vision in Mining</span>
        <span>
          Illustrated concepts. No live mine data or performance claims.
        </span>
        <a href="#mine">Follow the rock again ↑</a>
      </footer>
    </section>
  );
}
