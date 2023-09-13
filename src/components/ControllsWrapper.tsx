import { useAppState } from "../store/useAppState";
import Controlls from "./Controlls";
import styles from "./controllswrapper.module.css";

const ControllsWrapper = () => {
  const { setVolume, setEnvAtt, setEnvRel, setEnvTrg } = useAppState(
    (state) => ({
      setVolume: state.setVolume,
      setEnvAtt: state.setEnvAtt,
      setEnvRel: state.setEnvRel,
      setEnvTrg: state.setEnvTrg,
    })
  );
  return (
    <div className={styles.wrapper}>
      <Controlls
        name={"A"}
        index={0}
        setVolume={setVolume}
        setEnvAtt={setEnvAtt}
        setEnvRel={setEnvRel}
        setEnvTrg={setEnvTrg}
      />
      <Controlls
        name={"B"}
        index={1}
        setVolume={setVolume}
        setEnvAtt={setEnvAtt}
        setEnvRel={setEnvRel}
        setEnvTrg={setEnvTrg}
      />
      {/* <Controlls
        name={"C"}
        index={2}
        setVolume={setVolume}
        setEnvAtt={setEnvAtt}
        setEnvRel={setEnvRel}
        setEnvTrg={setEnvTrg}
      /> */}
    </div>
  );
};

export default ControllsWrapper;
