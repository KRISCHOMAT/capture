import Controlls from "./Controlls";
import styles from "./controllswrapper.module.css";
import useMasterStore from "../store/useMasterStore";

const ControllsWrapper = () => {
  const samples = useMasterStore((state) => state.samples);

  return (
    <div className={styles.wrapper}>
      {samples.map((sample, i) => {
        return (
          <Controlls
            key={i}
            name={String.fromCharCode(65 + i)}
            sample={sample()}
          />
        );
      })}
    </div>
  );
};

export default ControllsWrapper;
