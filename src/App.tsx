import "./App.css";
import WaveForm from "./components/WaveForm";
import ControllsWrapper from "./components/ControllsWrapper";
import Keyboard from "./components/Keyboard";
import { useAppState } from "./store/store";
import { shallow } from "zustand/shallow";

function App() {
  const { setRecordingA, setRecordingB, setRecordingC } = useAppState(
    (state) => ({
      setRecordingA: state.setRecordingA,
      setRecordingB: state.setRecordingB,
      setRecordingC: state.setRecordingC,
    }),
    shallow
  );
  return (
    <>
      <div className="logo">
        <h1>Capture</h1>
      </div>
      <WaveForm name="A" setRecording={setRecordingA} />
      <WaveForm name="B" setRecording={setRecordingB} />
      <WaveForm name="C" setRecording={setRecordingC} />
      <ControllsWrapper />
      <Keyboard />
    </>
  );
}

export default App;
