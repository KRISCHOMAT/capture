import "./App.css";
import WaveForm from "./components/WaveForm";
import Keyboard from "./components/Keyboard";
import constants from "./utils/constants";
import TabMenu from "./components/TabMenu/TabMenu";

function App() {
  return (
    <div className="app">
      <div className="logo">
        <h1>Capture</h1>
        <span>Version 1.0.1</span>
      </div>
      {Array.from({ length: constants.NUM_SAMPLES }).map((_, i) => {
        return (
          <WaveForm name={String.fromCharCode(65 + i)} index={i} key={i} />
        );
      })}
      <TabMenu />
      <Keyboard />
    </div>
  );
}

export default App;
