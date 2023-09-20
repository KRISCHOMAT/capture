import "./App.css";
import Keyboard from "./components/Keyboard/Keyboard";
import TabMenu from "./components/TabMenu/TabMenu";
import useMasterStore from "./store/useMasterStore";
import WaveForm from "./components/WaveForm/WaveForm";
import { Tab } from "./components/TabMenu/TabMenu";
import ControllsWrapper from "./components/Controlls/ControllsWrapper";
import MainControls from "./components/Controlls/MainControls";

const tabs: Tab[] = [
  { title: "Samples", element: ControllsWrapper },
  { title: "Main", element: MainControls },
];

function App() {
  const samples = useMasterStore((state) => state.samples);

  return (
    <>
      <div className="app">
        <div className="logo">
          <h1>Capture</h1>
          <span>Version 1.2.0</span>
        </div>

        <div>
          {samples.map((sample, i) => {
            return (
              <WaveForm
                key={i}
                name={String.fromCharCode(65 + i)}
                sample={sample()}
              />
            );
          })}
        </div>
        <TabMenu tabs={tabs} />

        <Keyboard />
      </div>
    </>
  );
}

export default App;
