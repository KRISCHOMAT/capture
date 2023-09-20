import { useState } from "react";
import styles from "./tabmenu.module.css";

export interface Tab {
  title: string;
  element: () => JSX.Element;
}

interface Props {
  tabs: Tab[];
}

const TabMenu = ({ tabs }: Props) => {
  const [activeId, setActiveId] = useState(0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuContainer}>
        {tabs.map((tab, i) => {
          return (
            <div
              className={styles.link}
              onClick={() => setActiveId(i)}
              style={{
                borderBottom:
                  activeId === i ? "2px solid #082943" : " 1px solid",
              }}
              key={tab.title}
            >
              {tab.title}
            </div>
          );
        })}
      </div>
      <div className={styles.output}>
        {tabs.map((tab, i) => {
          return (
            <div
              className={styles.option}
              style={{ display: activeId === i ? "flex" : "none" }}
              key={i}
            >
              <tab.element />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabMenu;
