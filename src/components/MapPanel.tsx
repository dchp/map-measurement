import "./MapPanel.css";

import { observer } from "mobx-react-lite";
import mapStore from "./MapStore";
import MeasureTable from "./MapTable";
import SummaryTable from "./SummaryTable";
import UnitSettingsButton from "./UnitSettingButton";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { PlusCircle, ArrowClockwise } from "react-bootstrap-icons";

const MeasurePanel = () => {
  return (
    <div className="map-panel">
      <h2>Measurement</h2>
      <ActionsToolbar />
      <MeasureTable />
      <SummaryTable />
    </div>
  );
};

const ActionsToolbar = observer(() => {
  return (
    <ButtonToolbar>
      <ButtonGroup>
        <Button
          variant="light"
          disabled={!mapStore.startPoint}
          onClick={() => {
            mapStore.addSector(
              mapStore.endPoint!,
              mapStore.endPoint!,
              mapStore.lastSector
            );
          }}
        >
          <span className="icon">
            <PlusCircle />
          </span>
          Add sector
        </Button>
        <UnitSettingsButton />
        <Button
          variant="light"
          disabled={mapStore.sectors.length === 0 && !mapStore.startPoint}
          onClick={() => mapStore.clean()}
        >
          <span className="icon">
            <ArrowClockwise />
          </span>
          New measurement
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
});

export default MeasurePanel;
