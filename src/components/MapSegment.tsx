import { RFeature, RLayerVector, RStyle } from "rlayers";
import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RCircle, RFill, RStroke } from "rlayers/style";
import { LineString, Point } from "ol/geom";
import { mapStore } from "./MapStore";
import { Sector } from "./Sector";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

export const MapSegment = observer(
  ({
    isHoveredSector,
    sector,
    id,
    setHoverSectorId,
    stopPropagation,
    setWillBeClickHandled,
    setIsDraggedByPoint,
  }: {
    isHoveredSector: boolean;
    sector: Sector;
    id: string;
    setHoverSectorId: React.Dispatch<React.SetStateAction<string>>;
    stopPropagation: (ev: any) => void;
    setWillBeClickHandled: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDraggedByPoint: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <div>
        <RLayerVector zIndex={isHoveredSector ? 10000 : undefined}>
          <RStyle.RStyle>
            <RStroke color={isHoveredSector ? "red" : "black"} width={2} />
          </RStyle.RStyle>

          <RFeature
            geometry={new LineString([sector.startPoint, sector.endPoint])}
            onPointerEnter={() => {
              setHoverSectorId(id);
            }}
            onPointerLeave={() => setHoverSectorId("")}
          />
        </RLayerVector>

        <RLayerVector zIndex={300000}>
          <RStyle.RStyle>
            <RCircle radius={isHoveredSector ? 6 : 5}>
              <RFill color={isHoveredSector ? "red" : "black"} />
              <RStroke color={"transparent"} width={10} />
            </RCircle>
          </RStyle.RStyle>

          <RFeature
            geometry={new Point(sector.endPoint)}
            onPointerEnter={(ev) => {
              stopPropagation(ev);
              setHoverSectorId(id);
              setWillBeClickHandled(true);
            }}
            onPointerLeave={(ev) => {
              stopPropagation(ev);
              setHoverSectorId("");
              setWillBeClickHandled(false);
            }}
            onClick={(ev) => {
              if (mapStore.isEditing) {
                return;
              }
              ev.stopPropagation();
              mapStore.removeSector(id);
              setHoverSectorId("");
            }}
            onPointerDrag={(e) => {
              stopPropagation(e);

              runInAction(() => {
                setWillBeClickHandled(true);
                setIsDraggedByPoint(true);

                const coords = e.map.getCoordinateFromPixel(e.pixel);
                sector.endPoint = coords;

                if (sector.nextSector) {
                  sector.nextSector.startPoint = coords;
                }
              });
            }}
            onPointerDragEnd={() => {
              setIsDraggedByPoint(false);
            }}
          />
        </RLayerVector>
      </div>
    );
  }
);
