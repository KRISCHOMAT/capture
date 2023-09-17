import useMasterStore from "../../store/useMasterStore";
import Slider from "../Slider/Slider";
import styles from "./controlls.module.css";

const MainControls = () => {
  const setAtt = useMasterStore((state) => state.setAtt);
  const setRel = useMasterStore((state) => state.setRel);
  const setVol = useMasterStore((state) => state.setVol);

  const handleSetAttack = (attack: number) => {
    setAtt(attack * 10);
  };

  const handleSetRelease = (release: number) => {
    setRel(release * 10);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>
        <div className={styles.hr} />
        <span>Main</span>
        <div className={styles.hr} />
      </div>
      <div className={styles.container}>
        <Slider initVal={75} label="Vol" setter={setVol} />
        <Slider initVal={30} label="Att" setter={handleSetAttack} />
        <Slider initVal={30} label="Rel" setter={handleSetRelease} />
      </div>
    </div>
  );
};

export default MainControls;
