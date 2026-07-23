import { useDeploymentJourney } from "../motion/useDeploymentJourney";
import PipelineSpine from "./PipelineSpine";
import JourneyStage from "./JourneyStage";
import { PIPELINE_STAGES } from "./pipelineConfig";
import PushStage from "./stages/PushStage";

export default function PipelineLayout() {
  const { containerRef, stageRefs, state, markStageComplete, scrollToFirstStage } = useDeploymentJourney();

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-zinc-950">
      <PipelineSpine journey={state} />

      <PushStage
        sectionRef={(el) => {
          stageRefs.current[0] = el;
        }}
        onWatchDeployment={scrollToFirstStage}
      />

      {PIPELINE_STAGES.slice(1).map((stage, offset) => {
        const index = offset + 1;
        return (
          <JourneyStage
            key={stage.id}
            index={index}
            stage={stage}
            phase={state.phases[index]}
            sectionRef={(el) => {
              stageRefs.current[index] = el;
            }}
            onComplete={() => markStageComplete(index)}
          />
        );
      })}
    </div>
  );
}
