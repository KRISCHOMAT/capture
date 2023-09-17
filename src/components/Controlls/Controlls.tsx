import Slider from "../Slider/Slider";
import styles from "./controlls.module.css";
import { SampleStore } from "../../store/useSampleStore";

interface Props {
  name: string;

  sample: SampleStore;
}

const Controlls = ({ name, sample }: Props) => {
  const { setAtt, setRel, setTrig, setVol } = sample;

  const handleSetVolume = (vol: number) => {
    setVol(vol);
  };

  const handleSetAtt = (att: number) => {
    setAtt(att / 2);
  };

  const handleSetRel = (rel: number) => {
    setRel(rel / 2);
  };

  const handleSetTrg = (trg: number) => {
    setTrig(trg);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>
        <div className={styles.hr} />
        <span>{name}</span>
        <div className={styles.hr} />
      </div>
      <div className={styles.container}>
        <Slider initVal={50} setter={handleSetVolume} label="Vol" />
        <Slider initVal={100} setter={handleSetAtt} label={"Att"} />
        <Slider initVal={100} setter={handleSetRel} label={"Rel"} />
        <Slider initVal={50} setter={handleSetTrg} label={"Trig"} />
      </div>
    </div>
  );
};

export default Controlls;
