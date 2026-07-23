import { PIPELINE_STAGES } from "./pipelineConfig";
import { buildPcbPath, approxPcbLength } from "./pipelineUtils";

export interface TipPose {
  x: number;
  y: number;
  angle: number;
}

export interface PathGeometry {
  segmentPaths: string[];
  segmentStarts: number[];
  segmentLengths: number[];
  totalLength: number;
  nodeYs: number[];
}

const SEGMENT_COUNT = PIPELINE_STAGES.length - 1;

export function buildPathGeometry(nodeYs: number[]): PathGeometry {
  const segmentPaths: string[] = [];
  const segmentLengths: number[] = [];
  const segmentStarts: number[] = [];
  let totalLength = 0;

  for (let index = 0; index < SEGMENT_COUNT; index += 1) {
    const from = PIPELINE_STAGES[index];
    const to = PIPELINE_STAGES[index + 1];
    const fromY = nodeYs[index] ?? 0;
    const toY = nodeYs[index + 1] ?? fromY + 300;

    segmentStarts.push(totalLength);
    segmentPaths.push(buildPcbPath(from.nodeX, fromY, to.nodeX, toY));

    const length = approxPcbLength(from.nodeX, fromY, to.nodeX, toY);
    segmentLengths.push(length);
    totalLength += length;
  }

  return { segmentPaths, segmentStarts, segmentLengths, totalLength, nodeYs };
}

export function segmentDash(
  pathEl: SVGPathElement | null,
  segmentProgress: number,
): string {
  if (!pathEl) return "0 9999";
  const total = pathEl.getTotalLength();
  const drawn = total * Math.max(0, Math.min(1, segmentProgress));
  return `${drawn} ${total}`;
}
