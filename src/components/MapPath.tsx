import "./MapPath.scss";

import { RControl, RFeature, RLayerVector, RStyle } from "rlayers";
import { RCircle, RFill, RStroke } from "rlayers/style";
import { LineString, Point } from "ol/geom";
import mapStore from "./MapStore";
import { Coordinate } from "ol/coordinate";
import MapSector from "./MapSector";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import StartPoint from "./StartPoint";
import { X } from "react-bootstrap-icons";

const MeasurePath = observer(
  ({
    plannedPoint,
    setWillBeClickHandled,
  }: {
    plannedPoint: Coordinate | undefined;
    setWillBeClickHandled: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <>
        <QuitMeasurement />

        <StartPoint setWillBeClickHandled={setWillBeClickHandled} />

        {mapStore.sectors.length > 0 &&
          mapStore.sectors.map((sector) => {
            const isHoveredSector =
              !mapStore.isEditing && mapStore.hoverSectorId === sector.id;

            return (
              <MapSector
                key={sector.id}
                id={sector.id}
                isHoveredSector={isHoveredSector && mapStore.isHoverActive}
                sector={sector}
                setWillBeClickHandled={setWillBeClickHandled}
              />
            );
          })}

        {!mapStore.isDraggedByPoint && plannedPoint && mapStore.endPoint && (
          <MapSectorPlanned
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
        <span className="x-icon">
          <X />
        </span>
        <span>Quit measurement</span>
      </button>
    </RControl.RCustom>
  );
});

const MapSectorPlanned = observer(
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
