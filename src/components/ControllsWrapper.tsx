import Controlls from "./Controlls";
import styles from "./controllswrapper.module.css";

const ControllsWrapper = () => {
  return (
    <div className={styles.wrapper}>
      <Controlls name={"A"} />
      <Controlls name={"B"} />
      <Controlls name={"C"} />
    </div>
  );
};

export default ControllsWrapper;
