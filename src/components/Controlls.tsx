import Slider from "./Slider";
import styles from "./controlls.module.css";

interface Props {
  name: string;
}

const Controlls = ({ name }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>
        <div className={styles.hr} />
        <span>{name}</span>
        <div className={styles.hr} />
      </div>
      <div className={styles.container}>
        <Slider />
        <Slider />
        <Slider />
        <Slider />
        <Slider />
      </div>
    </div>
  );
};

export default Controlls;
