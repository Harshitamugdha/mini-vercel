// ─── usePipelineScroll ────────────────────────────────────────────────────────
// Re-exports the unified deployment journey hook for backward compatibility.

export {
  useDeploymentJourney,
  useDeploymentJourney as usePipelineScroll,
  type JourneyState,
  type JourneyState as PipelineScrollState,
  type JourneyHandles,
  type JourneyHandles as PipelineScrollHandles,
  type StagePhase,
} from "./useDeploymentJourney";
