import { useState } from "react";
import styles from "./tabmenu.module.css";
import ControllsWrapper from "../ControllsWrapper";
import MainControls from "../MainControls";

const TabMenu = () => {
  const [activeId, setActiveId] = useState(0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuContainer}>
        <div
          className={styles.link}
          onClick={() => {
            setActiveId(0);
          }}
          style={{
            borderBottom: activeId === 0 ? "1px solid #082943" : "1px solid",
          }}
        >
          Samples
        </div>
        <div
          className={styles.link}
          onClick={() => {
            setActiveId(1);
          }}
          style={{
            borderBottom: activeId === 1 ? "1px solid #082943" : "1px solid",
          }}
        >
          Main
        </div>
      </div>
      <div className={styles.output}>
        <div
          className={styles.option}
          style={{
            display: activeId === 0 ? "flex" : "none",
          }}
        >
          <ControllsWrapper />
        </div>
        <div
          className={styles.option}
          style={{
            display: activeId === 1 ? "flex" : "none",
          }}
        >
          <MainControls />
        </div>
      </div>
    </div>
  );
};

export default TabMenu;
