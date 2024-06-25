import "./SummaryTable.css";
import { observer } from "mobx-react-lite";
import mapStore from "./MapStore";
import CoordinatePoint from "./CoordinatePoint";
import { Coordinate } from "ol/coordinate";
import { useState } from "react";
import EditButtons from "./EditButtons";

const SummaryTable = observer(() => {
  const [isEditingStartPoint, setIsEditingStartPoint] = useState(false);

  return (
    <div className="total">
      <div className="measure">
        <div className="name">Total distance:</div>
        <div className="value">{mapStore.totalDistance.tostring()}</div>
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
            onCapturePosition={(position) => {
              mapStore.setStartPoint(position);
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default SummaryTable;
