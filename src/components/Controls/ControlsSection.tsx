import Slider from "../Slider/Slider";
import styles from "./styles/controls.module.css";

export interface ControlsData {
  setter: (val: number) => void;
  label: string;
  initVal: number;
}

interface Props {
  name: string;
  controlsData: ControlsData[];
}

const ControlsSection = ({ name, controlsData }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>
        <div className={styles.hr} />
        <span>{name}</span>
        <div className={styles.hr} />
      </div>
      <div className={styles.container}>
        {controlsData.map((data, i) => {
          return (
            <Slider
              key={i}
              setter={data.setter}
              label={data.label}
              initVal={data.initVal}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ControlsSection;
