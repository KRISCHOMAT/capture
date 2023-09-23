import "./App.css";
import Keyboard from "./components/Keyboard/Keyboard";
import TabMenu from "./components/TabMenu/TabMenu";
import useMasterStore from "./store/useMasterStore";
import WaveForm from "./components/WaveForm/WaveForm";
import { Tab } from "./components/TabMenu/TabMenu";
import SampleControls from "./components/Controls/SampleControls";
import MainControls from "./components/Controls/MainControls";
// import ModulationControls from "./components/Controls/ModulationControls";

const tabs: Tab[] = [
  { title: "Samples", element: SampleControls },
  // { title: "Modulation", element: ModulationControls },
  { title: "Main", element: MainControls },
];

function App() {
  const samples = useMasterStore((state) => state.samples);

  return (
    <>
      <div className="app">
        <div className="header">
          <span className="info">Optimized for Chrome / Chromium </span>
          <div className="logo">
            <h1>Capture</h1>
            <span>Version 1.2.2</span>
          </div>
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
