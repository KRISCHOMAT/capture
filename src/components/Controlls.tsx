import Slider from "./Slider";
import styles from "./controlls.module.css";

interface Props {
  name: string;
  index: number;
  setVolume: (volume: number, index: number) => void;
  setEnvAtt: (att: number, index: number) => void;
  setEnvRel: (rel: number, index: number) => void;
  setEnvTrg: (trg: number, index: number) => void;
}

const Controlls = ({
  name,
  index,
  setVolume,
  setEnvAtt,
  setEnvRel,
  setEnvTrg,
}: Props) => {
  const handleSetVolume = (vol: number) => {
    setVolume(vol, index);
  };
  const handleSetAtt = (att: number) => {
    setEnvAtt(att / 2, index);
  };

  const handleSetRel = (rel: number) => {
    setEnvRel(rel / 2, index);
  };

  const handleSetTrg = (trg: number) => {
    setEnvTrg(trg, index);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>
        <div className={styles.hr} />
        <span>{name}</span>
        <div className={styles.hr} />
      </div>
      <div className={styles.container}>
        <Slider setter={handleSetVolume} label="Vol" />
        <Slider setter={handleSetAtt} label={"Att"} />
        <Slider setter={handleSetRel} label={"Rel"} />
        <Slider setter={handleSetTrg} label={"Trig"} />
      </div>
    </div>
  );
};

export default Controlls;
