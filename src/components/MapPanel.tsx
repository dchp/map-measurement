import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { observer } from "mobx-react-lite";
import { mapStore } from "./MapStore";
import { MeasureTable } from "./MapTable";
import "./MapPanel.css";
import { SummaryTable } from "./SummaryTable";
import UnitSettingsButton from "./UnitSettingButton";
import { Button } from "react-bootstrap";
import { PlusCircle, ArrowClockwise } from "react-bootstrap-icons";

export const MeasurePanel = () => {
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
    <div className="btn-toolbar" role="toolbar">
      <div className="btn-group me-2" role="group" aria-label="First group">
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
      </div>
    </div>
  );
});
