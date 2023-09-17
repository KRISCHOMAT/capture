import styles from "./keyboard.module.css";
import Key from "./Key";
import useMasterStore from "../../store/useMasterStore";

const Keyboard = () => {
  const voices = useMasterStore((state) => state.voices);

  return (
    <div className={styles.wrapper}>
      {voices.map((voice, id) => {
        return <Key voice={voice()} key={id} />;
      })}
    </div>
  );
};

export default Keyboard;
