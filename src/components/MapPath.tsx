import { RControl, RFeature, RLayerVector, RStyle } from "rlayers";
import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RCircle, RFill, RStroke } from "rlayers/style";
import { LineString, Point } from "ol/geom";
import { mapStore } from "./MapStore";
import { Coordinate } from "ol/coordinate";
import { useState } from "react";
import { MapSegment } from "./MapSegment";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import "./MapPath.css";
import StartPoint from "./StartPoint";

const MeasurePath = observer(
  ({
    hoverSectorId,
    plannedPoint,
    setHoverSectorId,
    stopPropagation,
    setWillBeClickHandled,
  }: {
    hoverSectorId: string;
    plannedPoint: Coordinate | undefined;
    setHoverSectorId: React.Dispatch<React.SetStateAction<string>>;
    stopPropagation: (ev: any) => void;
    setWillBeClickHandled: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const [isDraggedByPoint, setIsDraggedByPoint] = useState(false);

    return (
      <>
        <QuitMeasurement />

        <StartPoint
          setWillBeClickHandled={setWillBeClickHandled}
          setIsDraggedByPoint={setIsDraggedByPoint}
        />

        {mapStore.sectors.length > 0 &&
          mapStore.sectors.map((sector) => {
            const isHoveredSector =
              !mapStore.isEditing && hoverSectorId === sector.id;

            return (
              <MapSegment
                key={sector.id}
                id={sector.id}
                isHoveredSector={isHoveredSector}
                sector={sector}
                setHoverSectorId={setHoverSectorId}
                stopPropagation={stopPropagation}
                setWillBeClickHandled={setWillBeClickHandled}
                setIsDraggedByPoint={setIsDraggedByPoint}
              />
            );
          })}

        {!isDraggedByPoint && plannedPoint && mapStore.endPoint && (
          <MapSegmentPlanned
            startPoint={mapStore.endPoint}
            endPoint={plannedPoint}
          />
        )}
      </>
    );
  }
);

const QuitMeasurement = observer(() => {
  return (
    <RControl.RCustom className="quit-measurement">
      <button
        onClick={() =>
          runInAction(() => {
            mapStore.isEditing = false;
          })
        }
        hidden={!mapStore.isEditing}
      >
        <i className="bi bi-x" />
        Quit measurement
      </button>
    </RControl.RCustom>
  );
});

const MapSegmentPlanned = observer(
  ({
    startPoint,
    endPoint: plannedPoint,
  }: {
    startPoint: Coordinate;
    endPoint: Coordinate;
  }) => {
    return (
      <>
        {mapStore.isEditing && (
          <RLayerVector>
            <RStyle.RStyle>
              <RStroke color="black" width={2} lineDash={[8, 8]} />
              <RCircle radius={6}>
                <RFill color="black" />
              </RCircle>
            </RStyle.RStyle>

            <RFeature geometry={new Point(plannedPoint)} />

            <RFeature geometry={new LineString([startPoint, plannedPoint])} />
          </RLayerVector>
        )}
      </>
    );
  }
);

export default MeasurePath;
