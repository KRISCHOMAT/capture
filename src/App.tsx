import "./App.css";
import WaveForm from "./components/WaveForm";
import ControllsWrapper from "./components/ControllsWrapper";
import Keyboard from "./components/Keyboard";
import constants from "./utils/constants";
import MainControls from "./components/MainControls";
import TabMenu from "./components/TabMenu/TabMenu";

function App() {
  return (
    <div className="app">
      {/* <div className="logo">
        <h1>Capture</h1>
      </div> */}
      {Array.from({ length: constants.NUM_SAMPLES }).map((_, i) => {
        return (
          <WaveForm name={String.fromCharCode(65 + i)} index={i} key={i} />
        );
      })}
      <TabMenu />

      <ControllsWrapper />
      <Keyboard />
      <MainControls />
    </div>
  );
}

export default App;
