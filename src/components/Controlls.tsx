import Slider from "./Slider";
import styles from "./controlls.module.css";

interface Props {
  name: string;
  index: number;
  setVolume: (volume: number, index: number) => void;
}

const Controlls = ({ name, index, setVolume }: Props) => {
  const handleSetVolume = (vol: number) => {
    setVolume(vol, index);
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
        <Slider label={"Att"} />
        <Slider label={"Rel"} />
        <Slider label={"Trig"} />
      </div>
    </div>
  );
};

export default Controlls;
