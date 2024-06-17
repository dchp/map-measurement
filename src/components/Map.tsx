import { RControl, RMap, ROSM } from "rlayers";
import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapBrowserEvent } from "ol";
import { useCallback, useEffect, useState } from "react";
import { Coordinate } from "ol/coordinate";
import { stopPropagation } from "ol/events/Event";
import { RView } from "rlayers/RMap";
import { fromLonLat } from "ol/proj";
import { observer } from "mobx-react-lite";
import { mapStore } from "./MapStore";
import MeasurePath from "./MapPath";
import { runInAction } from "mobx";
import "./MapPanel.css";

export interface MapProps {
  hoverSectorId: string;
  setHoverSectorId: React.Dispatch<React.SetStateAction<string>>;
  editSectorId: string;
  setEditSectorId: React.Dispatch<React.SetStateAction<string>>;
}

export const Map = observer(
  ({ hoverSectorId, setHoverSectorId }: MapProps & {}): JSX.Element => {
    const origin: Coordinate = [17.25, 49.59]; // Olomouc city
    const initial: RView = { center: fromLonLat(origin), zoom: 11 };
    const [plannedPoint, setPlannedPoint] = useState<Coordinate | undefined>(
      undefined
    );

    // do not handle click if it will be handled by inner item (RMap onClick is called before inner item onClick)
    const [willBeClickHandled, setWillBeClickHandled] = useState(false);

    useEscapeKey(() =>
      runInAction(() => {
        mapStore.isEditing = false;
      })
    );

    return (
      <div id="map">
        <RMap
          width={"100%"}
          height={"100%"}
          noDefaultControls
          initial={initial}
          minZoom={3}
          maxZoom={17}
          onClick={useCallback(
            (e: MapBrowserEvent<UIEvent>) => {
              if (willBeClickHandled) {
                setWillBeClickHandled(false);
                return;
              }
              const coords = e.map.getCoordinateFromPixel(e.pixel);
              mapStore.addPoint(coords);
            },
            [willBeClickHandled]
          )}
          onPointerMove={useCallback((e: MapBrowserEvent<UIEvent>) => {
            const coords = e.map.getCoordinateFromPixel(e.pixel);
            setPlannedPoint(coords);
          }, [])}
        >
          <ROSM />

          <MeasurePath
            hoverSectorId={hoverSectorId}
            plannedPoint={plannedPoint}
            setHoverSectorId={setHoverSectorId}
            stopPropagation={stopPropagation}
            setWillBeClickHandled={setWillBeClickHandled}
          />

          <RControl.RScaleLine />
          <RControl.RZoom />
          <RControl.RAttribution />
        </RMap>
      </div>
    );
  }
);

function useEscapeKey(callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback]);
}
