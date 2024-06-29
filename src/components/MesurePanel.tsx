import "./MesurePanel.scss";

import MeasureToolbar from "./MeasureToolbar";
import MeasureTable from "./MeasureTable";
import MeasureSummary from "./MeasureSummary";

const MesurePanel = () => {
  return (
    <div className="mesure-panel">
      <h2>Measurement</h2>
      <MeasureToolbar />
      <MeasureTable />
      <MeasureSummary />
    </div>
  );
};

export default MesurePanel;
