import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { observer } from "mobx-react-lite";
import { mapStore } from "./MapStore";
import { MeasureTable } from "./MapTable";
import "./MapPanel.css";
import { CoordinatePoint } from "./CoordinatePoint";
import { Coordinate } from "ol/coordinate";
import { useState } from "react";
import { EditButtons } from "./EditButtons";

export const MeasurePanel = ({
  editSectorId,
  hoverSectorId,
  setHoverSectorId,
  setEditSectorId,
}: {
  editSectorId: string;
  hoverSectorId: string;
  setHoverSectorId: React.Dispatch<React.SetStateAction<string>>;
  setEditSectorId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="map-panel">
      <h2>Measurement</h2>
      <ActionsToolbar />

      <MeasureTable
        editSectorId={editSectorId}
        hoverSectorId={hoverSectorId}
        setHoverSectorId={setHoverSectorId}
        setEditSectorId={setEditSectorId}
      />

      <SummaryTable />
    </div>
  );
};

const ActionsToolbar = observer(() => {
  return (
    <div className="btn-toolbar" role="toolbar">
      <div className="btn-group me-2" role="group" aria-label="First group">
        <button
          type="button"
          className="btn btn-light"
          disabled={mapStore.sectors.length === 0}
          onClick={() => {
            mapStore.addSector(
              mapStore.endPoint!,
              mapStore.endPoint!,
              mapStore.lastSector
            );
          }}
        >
          <i className="bi bi-plus-circle" />
          Add sector
        </button>
        <button
          type="button"
          className="btn btn-light"
          disabled={mapStore.sectors.length === 0 && !mapStore.startPoint}
          onClick={() => mapStore.clean()}
        >
          <i className="bi bi-arrow-clockwise" />
          New measurement
        </button>
      </div>
    </div>
  );
});

const SummaryTable = observer(() => {
  const [isEditingStartPoint, setIsEditingStartPoint] = useState(false);

  return (
    <div className="total">
      <div className="measure">
        <div className="name">Total distance:</div>
        <div className="value">
          {mapStore.sectors
            .reduce((sum, sector) => sum + sector.distanceInKm, 0)
            .toFixed(2)}{" "}
          km
        </div>
      </div>
      <div className="measure start-point">
        <div className="name">Start point:</div>
        <div className="value">
          <CoordinatePoint
            point={mapStore.startPoint}
            isEditing={isEditingStartPoint}
            onChange={function (newValue: Coordinate): void {
              mapStore.setStartPoint(newValue);
            }}
          />
          <EditButtons
            isEditing={isEditingStartPoint}
            onEditingChange={(isEditing) => setIsEditingStartPoint(isEditing)}
          />
        </div>
      </div>
    </div>
  );
});
