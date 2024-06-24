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

const hoveredColor = "red";
const unhoveredColor = "black";

export const MapSector = observer(
  ({
    isHoveredSector,
    sector,
    id,
    stopPropagation,
    setWillBeClickHandled,
  }: {
    isHoveredSector: boolean;
    sector: Sector;
    id: string;
    stopPropagation: (ev: any) => void;
    setWillBeClickHandled: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <div>
        <RLayerVector zIndex={isHoveredSector ? 10000 : undefined}>
          <RStyle.RStyle>
            <RStroke
              color={isHoveredSector ? hoveredColor : unhoveredColor}
              width={2}
            />
          </RStyle.RStyle>

          <RFeature
            geometry={new LineString([sector.startPoint, sector.endPoint])}
            onPointerEnter={() =>
              runInAction(() => {
                mapStore.hoverSectorId = id;
              })
            }
            onPointerLeave={() =>
              runInAction(() => {
                mapStore.hoverSectorId = "";
              })
            }
          />
        </RLayerVector>

        <RLayerVector zIndex={300000}>
          <RStyle.RStyle>
            <RCircle radius={isHoveredSector ? 6 : 5}>
              <RFill color={isHoveredSector ? hoveredColor : unhoveredColor} />
              <RStroke color={"transparent"} width={10} />
            </RCircle>
          </RStyle.RStyle>

          <RFeature
            geometry={new Point(sector.endPoint)}
            onPointerEnter={(ev) =>
              runInAction(() => {
                stopPropagation(ev);
                mapStore.hoverSectorId = id;
                setWillBeClickHandled(true);
              })
            }
            onPointerLeave={(ev) =>
              runInAction(() => {
                stopPropagation(ev);
                mapStore.hoverSectorId = "";
                setWillBeClickHandled(false);
              })
            }
            onClick={(ev) =>
              runInAction(() => {
                if (mapStore.isEditing) {
                  return;
                }
                ev.stopPropagation();
                mapStore.removeSector(id);
                mapStore.hoverSectorId = "";
              })
            }
            onPointerDrag={(e) =>
              runInAction(() => {
                stopPropagation(e);

                runInAction(() => {
                  setWillBeClickHandled(true);
                  mapStore.isDraggedByPoint = true;

                  const coords = e.map.getCoordinateFromPixel(e.pixel);
                  sector.endPoint = coords;

                  if (sector.nextSector) {
                    sector.nextSector.startPoint = coords;
                  }
                });
              })
            }
            onPointerDragEnd={() =>
              runInAction(() => {
                mapStore.isDraggedByPoint = false;
              })
            }
          />
        </RLayerVector>
      </div>
    );
  }
);
