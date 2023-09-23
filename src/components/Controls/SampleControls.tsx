import styles from "./styles/controlsWrapper.module.css";
import useMasterStore from "../../store/useMasterStore";
import ControlsSection from "./ControlsSection";
import { ControlsData } from "./ControlsSection";

const SampleControls = () => {
  const samples = useMasterStore((state) => state.samples);

  return (
    <div className={styles.wrapper}>
      {samples.map((sample, i) => {
        const controlsData: ControlsData[] = [
          { label: "vol", setter: sample().setVol, initVal: 0.5 },
          { label: "att", setter: sample().setAtt, initVal: 0.3 },
          { label: "rel", setter: sample().setRel, initVal: 0.3 },
          { label: "trig", setter: sample().setTrig, initVal: 0.5 },
        ];
        return (
          <ControlsSection
            key={i}
            name={String.fromCharCode(65 + i)}
            controlsData={controlsData}
          />
        );
      })}
    </div>
  );
};

export default SampleControls;
