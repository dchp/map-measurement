import "./MapPanel.css";

import { RControl, RMap, ROSM } from "rlayers";
import { MapBrowserEvent } from "ol";
import { Coordinate } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { useCallback, useEffect, useState } from "react";
import { RView } from "rlayers/RMap";
import { observer } from "mobx-react-lite";
import mapStore from "./MapStore";
import MeasurePath from "./MapPath";
import { runInAction } from "mobx";

const origin: Coordinate = [16.6, 49.21];
const initial: RView = { center: fromLonLat(origin), zoom: 12 };

const Map = observer((): JSX.Element => {
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
    <div className="map">
      <RMap
        noDefaultControls
        initial={initial}
        minZoom={5}
        maxZoom={17}
        width={"100%"}
        height={"100%"}
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
        // view={[view, setView]} // does not work map move when onPointerMove is set
        onPointerMove={useCallback((e: MapBrowserEvent<UIEvent>) => {
          const coords = e.map.getCoordinateFromPixel(e.pixel);
          setPlannedPoint(coords);
        }, [])}
      >
        <ROSM />

        <MeasurePath
          plannedPoint={plannedPoint}
          setWillBeClickHandled={setWillBeClickHandled}
        />

        <RControl.RScaleLine />
        <RControl.RZoom />
        <RControl.RAttribution />
      </RMap>
    </div>
  );
});

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

export default Map;
