import useMasterStore from "../../store/useMasterStore";
import ControlsSection from "./ControlsSection";
import { ControlsData } from "./ControlsSection";

const MainControls = () => {
  const setVol = useMasterStore((state) => state.setVol);
  const setRel = useMasterStore((state) => state.setRel);
  const setAtt = useMasterStore((state) => state.setAtt);
  const controlsData: ControlsData[] = [
    { label: "vol", setter: setVol, initVal: 0.75 },
    { label: "att", setter: setAtt, initVal: 0.2 },
    { label: "rel", setter: setRel, initVal: 0.2 },
  ];

  return <ControlsSection name="Main" controlsData={controlsData} />;
};

export default MainControls;
