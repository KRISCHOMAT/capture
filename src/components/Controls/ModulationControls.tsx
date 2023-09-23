import styles from "./styles/modulation.module.css";
import useMasterStore from "../../store/useMasterStore";
import ControlsSection from "./ControlsSection";
import { ControlsData } from "./ControlsSection";
import { useState } from "react";

const ModulationControls = () => {
  const voices = useMasterStore((state) => state.voices);

  const [selected, setSelected] = useState(0);

  const controlsData: ControlsData[] = [
    {
      label: "x",
      setter: (val) => {
        console.log(val);
      },
      initVal: 0.4,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.selector}>
        {voices.map((_, i) => {
          return (
            <span
              key={i}
              onClick={() => setSelected(i)}
              className={`${selected === i && styles.selected}`}
            >
              {i + 1}
            </span>
          );
        })}
      </div>
      <ControlsSection name={`V${selected + 1}`} controlsData={controlsData} />
    </div>
  );
};

export default ModulationControls;
