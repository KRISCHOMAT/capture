import "./App.css";
import WaveForm from "./components/WaveForm";
import ControllsWrapper from "./components/ControllsWrapper";
import Keyboard from "./components/Keyboard";
import constants from "./utils/constants";
import MainControls from "./components/MainControls";

function App() {
  return (
    <>
      <div className="logo">
        <h1>Capture</h1>
      </div>
      {Array.from({ length: constants.NUM_SAMPLES }).map((_, i) => {
        return (
          <WaveForm name={String.fromCharCode(65 + i)} index={i} key={i} />
        );
      })}

      <ControllsWrapper />
      <Keyboard />
      <MainControls />
    </>
  );
}

export default App;
