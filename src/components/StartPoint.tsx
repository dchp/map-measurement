import { RFeature, RLayerVector, RStyle } from "rlayers";
import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RCircle, RFill, RStroke } from "rlayers/style";
import { Point } from "ol/geom";
import { mapStore } from "./MapStore";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import "./MapPath.css";
import { stopPropagation } from "ol/events/Event";

const StartPoint = observer(
  ({
    setWillBeClickHandled,
    setIsDraggedByPoint,
  }: {
    setWillBeClickHandled: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDraggedByPoint: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <>
        {mapStore.startPoint && (
          <RLayerVector zIndex={10001}>
            <RStyle.RStyle>
              <RCircle radius={6}>
                <RFill color="white" />
                <RStroke color={"black"} width={2} />
              </RCircle>
            </RStyle.RStyle>
            <RFeature
              geometry={new Point(mapStore.startPoint)}
              onPointerEnter={(ev) => {
                stopPropagation(ev);
                setWillBeClickHandled(true);
              }}
              onPointerLeave={(ev) => {
                stopPropagation(ev);
                setWillBeClickHandled(false);
              }}
              onClick={(ev) => {
                if (mapStore.isEditing) {
                  return;
                }
                ev.stopPropagation();
              }}
              onPointerDrag={(e) => {
                stopPropagation(e);

                runInAction(() => {
                  setWillBeClickHandled(true);
                  setIsDraggedByPoint(true);
                  mapStore.setStartPoint(e.map.getCoordinateFromPixel(e.pixel));
                });
              }}
              onPointerDragEnd={() => {
                setIsDraggedByPoint(false);
              }}
            />
          </RLayerVector>
        )}
      </>
    );
  }
);

export default StartPoint;