import { useAppState } from "../store/useAppState";
import Slider from "./Slider";
import styles from "./controlls.module.css";

const MainControls = () => {
  const { setAttack, setRelease } = useAppState((state) => ({
    setAttack: state.setAttack,
    setRelease: state.setRelease,
  }));

  const handleSetAttack = (attack: number) => {
    setAttack(attack * 10);
  };

  const handleSetRelease = (release: number) => {
    setRelease(release * 10);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>
        <div className={styles.hr} />
        <span>Main</span>
        <div className={styles.hr} />
      </div>
      <div className={styles.container}>
        <Slider label="Att" setter={handleSetAttack} initVal={0} />
        <Slider label="Rel" setter={handleSetRelease} initVal={0} />
      </div>
    </div>
  );
};

export default MainControls;
