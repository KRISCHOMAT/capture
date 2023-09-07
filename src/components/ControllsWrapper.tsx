import { useAppState } from "../store/useAppState";
import Controlls from "./Controlls";
import styles from "./controllswrapper.module.css";

const ControllsWrapper = () => {
  const { setVolume } = useAppState((state) => ({
    setVolume: state.setVolume,
  }));
  return (
    <div className={styles.wrapper}>
      <Controlls name={"A"} index={0} setVolume={setVolume} />
      <Controlls name={"B"} index={1} setVolume={setVolume} />
      <Controlls name={"C"} index={2} setVolume={setVolume} />
    </div>
  );
};

export default ControllsWrapper;
