import { Coordinate } from "ol/coordinate";
import "./EditButtons.css";
import { fromLonLat } from "ol/proj";
import { Pencil, Check2, GeoAlt, Trash3 } from "react-bootstrap-icons";

export function EditButtons({
  isEditing,
  onEditingChange,
  onRemove,
  onCapturePosition,
}: {
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  onRemove?: () => void;
  onCapturePosition?: (position: Coordinate) => void;
}): JSX.Element {
  return (
    <div className="edit-buttons">
      {isEditing ? (
        <span onClick={() => onEditingChange(false)} className="icon">
          <Check2 />
        </span>
      ) : (
        <span onClick={() => onEditingChange(true)} className="icon">
          <Pencil />
        </span>
      )}
      {onCapturePosition && navigator.geolocation && (
        <span
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                onCapturePosition(
                  fromLonLat([
                    position.coords.longitude,
                    position.coords.latitude,
                  ])
                );
              },
              (error) => {
                console.error("Error capturing position", error);
              }
            );
          }}
        >
          <span className="icon">
            <GeoAlt />
          </span>
        </span>
      )}
      {onRemove && (
        <span onClick={() => onRemove()} className="icon">
          <Trash3 />
        </span>
      )}
    </div>
  );
}
