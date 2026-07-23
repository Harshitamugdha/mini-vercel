import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PIPELINE_STAGES } from "../pipeline/pipelineConfig";
import {
  buildPathGeometry,
  type PathGeometry,
  type TipPose,
} from "../pipeline/pipelinePath";

export type StagePhase = "waiting" | "playing" | "complete";

export interface JourneyState {
  phases: StagePhase[];
  segmentProgress: number[];
  activeSegmentIndex: number;
  tip: TipPose;
  nodeYs: number[];
  geometry: PathGeometry | null;
}

export interface JourneyHandles {
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  state: JourneyState;
  markStageComplete: (index: number) => void;
  scrollToFirstStage: () => void;
}

const STAGE_COUNT = PIPELINE_STAGES.length;
const SEGMENT_COUNT = STAGE_COUNT - 1;

function initialState(): JourneyState {
  return {
    phases: ["complete", ...Array(STAGE_COUNT - 1).fill("waiting")] as StagePhase[],
    segmentProgress: Array(SEGMENT_COUNT).fill(0),
    activeSegmentIndex: -1,
    tip: { x: PIPELINE_STAGES[0].nodeX, y: 0, angle: 90 },
    nodeYs: Array(STAGE_COUNT).fill(0),
    geometry: null,
  };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function progressFromScroll(container: HTMLDivElement, nodeYs: number[]): number {
  const startY = nodeYs[0] ?? 0;
  const endY = nodeYs[STAGE_COUNT - 1] ?? startY + 1;
  const containerTop = container.getBoundingClientRect().top + window.scrollY;
  const viewportPenY = window.scrollY - containerTop + window.innerHeight * 0.58;
  return clamp((viewportPenY - startY) / Math.max(1, endY - startY));
}

function segmentProgressFromTotal(progress: number, geometry: PathGeometry | null): {
  segmentProgress: number[];
  activeSegmentIndex: number;
} {
  if (!geometry || geometry.totalLength <= 0) {
    return {
      segmentProgress: Array(SEGMENT_COUNT).fill(0),
      activeSegmentIndex: -1,
    };
  }

  const drawnLength = geometry.totalLength * progress;
  let activeSegmentIndex = -1;

  const segmentProgress = geometry.segmentLengths.map((length, index) => {
    const start = geometry.segmentStarts[index] ?? 0;
    const local = clamp((drawnLength - start) / Math.max(1, length));
    if (local > 0 && local < 1) activeSegmentIndex = index;
    return local;
  });

  return { segmentProgress, activeSegmentIndex };
}

export function useDeploymentJourney(): JourneyHandles {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>(Array(STAGE_COUNT).fill(null));
  const maxProgressRef = useRef(0);

  const [state, setState] = useState<JourneyState>(() => initialState());

  const updateFromScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const nodeYs = stageRefs.current.map((stage) => {
      if (!stage) return 0;
      const anchor = stage.querySelector<HTMLElement>("[data-node-anchor]");
      const rect = (anchor ?? stage).getBoundingClientRect();
      return rect.top + window.scrollY - containerTop + rect.height * 0.5;
    });

    const geometry = buildPathGeometry(nodeYs);
    const progress = progressFromScroll(container, nodeYs);
    maxProgressRef.current = Math.max(maxProgressRef.current, progress);
    const { segmentProgress, activeSegmentIndex } = segmentProgressFromTotal(maxProgressRef.current, geometry);

    setState((current) => {
      const phases = [...current.phases];
      for (let index = 1; index < STAGE_COUNT; index += 1) {
        if (phases[index] === "waiting" && (segmentProgress[index - 1] ?? 0) >= 1) {
          phases[index] = "playing";
        }
      }

      return {
        ...current,
        phases,
        segmentProgress,
        activeSegmentIndex,
        nodeYs,
        geometry,
      };
    });
  }, []);

  const markStageComplete = useCallback((index: number) => {
    setState((current) => {
      if (current.phases[index] === "complete") return current;
      const phases = [...current.phases];
      phases[index] = "complete";
      return { ...current, phases };
    });
  }, []);

  const scrollToFirstStage = useCallback(() => {
    stageRefs.current[1]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    updateFromScroll();

    const ro = new ResizeObserver(updateFromScroll);
    if (containerRef.current) ro.observe(containerRef.current);
    stageRefs.current.forEach((stage) => stage && ro.observe(stage));

    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [updateFromScroll]);

  return useMemo(
    () => ({ containerRef, stageRefs, state, markStageComplete, scrollToFirstStage }),
    [state, markStageComplete, scrollToFirstStage],
  );
}

export type { JourneyState as PipelineScrollState };
export type { JourneyHandles as PipelineScrollHandles };
export { useDeploymentJourney as usePipelineScroll };
