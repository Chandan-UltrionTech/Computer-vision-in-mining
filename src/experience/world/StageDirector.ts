import type { SceneId } from "../core/types";
import { cameraAt, cameraTransform, pixelScale, projectPoint, type Frame } from "./CameraDirector";
import { DETONATOR, heavy, PLANT_X, ramp, RECOVERY_SHIFT, smooth } from "./actors";
import { updateGeologyPit } from "./GeologyPitWorld";
import { updateMaterialFlow } from "./MaterialFlowWorld";
import { updateRecovery } from "./RecoveryWorld";
import { ambientAt } from "../core/motionDirection";

/** Owns the persistent stage: camera rig, parallax depth, actor state and finale reactivation. */
export function createStageDirector(svg: SVGSVGElement, mobile: boolean) {
  const layers = Array.from(svg.querySelectorAll<SVGGElement>("[data-depth]")).map(el => ({ el, depth: Number(el.dataset.depth) }));
  const camera = svg.querySelector<SVGGElement>("[data-world-camera]")!;
  const signals = svg.querySelector<SVGGElement>("[data-finale-signals]")!;
  const networkRoute = signals?.querySelector<SVGPathElement>("[data-finale-network-route]");
  const markers = Array.from(signals?.querySelectorAll<SVGGElement>("[data-landmark-signal]") ?? []).map(el => ({
    el,
    x: Number(el.dataset.x),
    y: Number(el.dataset.y),
    pulse: el.querySelector<SVGElement>("[data-pulse]")!,
    label: el.querySelector<SVGElement>("[data-landmark-label]"),
    number: el.querySelector<SVGElement>("[data-number]"),
  }));
  const parts = ([["geology-pit", -400, 3750], ["material-flow", PLANT_X + 200, PLANT_X + 2100], ["recovery", RECOVERY_SHIFT + 4100, RECOVERY_SHIFT + 7400]] as const)
    .flatMap(([name, from, to]) => {
      const el = svg.querySelector<SVGGElement>(`[data-world-part="${name}"]`);
      return el ? [{ el, from, to, shown: true }] : [];
    });
  const host = (svg.closest("[data-journey]") as HTMLElement | null) ?? document.documentElement;
  let frame: Frame = { width: 1440, height: 900, mobile };
  const resize = () => {
    const r = svg.getBoundingClientRect();
    frame = { width: Math.max(1, Math.round(r.width || innerWidth)), height: Math.max(1, Math.round(r.height || innerHeight)), mobile };
    svg.setAttribute("viewBox", `0 0 ${frame.width} ${frame.height}`);
  };
  resize();
  let last = "";
  return {
    resize,
    render(scene: SceneId, p: number) {
      const pose = cameraAt(scene, p, mobile ? "mobile" : "desktop");
      const key = `${scene}:${p.toFixed(5)}:${frame.width}x${frame.height}`;
      if (key === last) return pose;
      last = key;
      for (const layer of layers) layer.el.setAttribute("transform", cameraTransform(pose, frame, layer.depth, scene));
      const ambient = ambientAt(scene, p);
      svg.dataset.ambientLevel = String(ambient);
      svg.dataset.ambientScene = scene;
      if (host instanceof HTMLElement) {
        host.dataset.ambientLevel = String(ambient);
        host.dataset.ambientScene = scene;
      }
      host.style.setProperty("--ambient-level", String(ambient));
      // Skip painting world parts that are entirely off screen.
      const o = projectPoint(pose, frame, pose.x, pose.y), margin = frame.width * .3 / o.k;
      const left = pose.x - o.x / o.k - margin, right = pose.x + (frame.width - o.x) / o.k + margin;
      for (const part of parts) {
        const show = part.to > left && part.from < right;
        if (part.shown !== show) { part.el.style.display = show ? "" : "none"; part.shown = show; }
      }
      camera.dataset.focus = `${pose.x.toFixed(2)},${pose.y.toFixed(2)},${pose.scale.toFixed(4)}`;
      svg.dataset.activeScene = scene;
      svg.dataset.localProgress = p.toFixed(4);
      updateGeologyPit(svg, scene, p);
      updateMaterialFlow(svg, scene, p);
      updateRecovery(svg, scene, p);
      if (scene === "blast" || scene === "grade") {
        const d = projectPoint(pose, frame, DETONATOR.x, DETONATOR.y);
        d.x = Math.min(frame.width - 70, Math.max(56, d.x));
        host.style.setProperty("--det-x", `${d.x.toFixed(1)}px`);
        host.style.setProperty("--det-y", `${d.y.toFixed(1)}px`);
        host.style.setProperty("--det-k", Math.min(1.25, Math.max(.7, d.k)).toFixed(3));
        host.style.setProperty("--det-press", scene === "blast" ? heavy(ramp(p, .14, .3)).toFixed(3) : "0");
      }
      // Capabilities reactivate place by place along the route already travelled.
      const unit = 1 / (pixelScale(frame) * pose.scale);
      const reveal = scene === "finale" ? ramp(p, 0.44, 0.88) : 0;

      // Animate subtle dashed network route linking all 12 capabilities
      if (networkRoute) {
        if (reveal > 0) {
          networkRoute.setAttribute("opacity", (reveal * 0.7).toFixed(3));
          const totalLength = 7200;
          networkRoute.style.strokeDasharray = `${totalLength}`;
          networkRoute.style.strokeDashoffset = `${(totalLength * (1 - reveal)).toFixed(1)}`;
        } else {
          networkRoute.setAttribute("opacity", "0");
        }
      }

      // Marker animation with label freshness:
      // Active / revealing marker: number, dot, label, pulse
      // Settled / past markers: number, subtle dot, label fades so <= 2 labels have opacity > 0.35 at p = 0.95
      markers.forEach((m, i) => {
        const stepStart = i / markers.length;
        const stepEnd = (i + 1.2) / markers.length;
        const on = smooth(ramp(reveal, stepStart, stepEnd));
        m.el.setAttribute("opacity", on.toFixed(3));
        m.el.setAttribute("transform", `translate(${m.x} ${m.y}) scale(${(unit * (.6 + on * .4)).toFixed(4)})`);
        m.pulse.setAttribute("r", (14 + Math.sin(on * Math.PI) * 12).toFixed(2));
        m.pulse.setAttribute("opacity", (Math.sin(on * Math.PI) * .9).toFixed(3));

        // Label freshness: fades out after next marker activates
        const settleFade = reveal >= (i + 1.8) / markers.length ? ramp(reveal, (i + 1.8) / markers.length, (i + 2.5) / markers.length) : 0;
        const labelOpacity = on * (1 - settleFade * 0.88);
        if (m.label) {
          m.label.setAttribute("opacity", labelOpacity.toFixed(3));
        }
      });
      return pose;
    },
  };
}
