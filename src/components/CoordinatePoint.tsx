import { fromLonLat, toLonLat } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { toGPSString } from "../utils/geometry";
import { observer } from "mobx-react-lite";

const CoordinatePoint = observer(
  ({
    point,
    isEditing,
    onChange,
  }: {
    point?: Coordinate;
    isEditing: boolean;
    onChange: (newValue: Coordinate) => void;
  }): JSX.Element => {
    return isEditing ? (
      <span className="editing">
        <Latitude point={point} onChange={onChange} />
        <Longitude point={point} onChange={onChange} />
      </span>
    ) : (
      <span>{point ? toGPSString(point) : "-"}</span>
    );
  }
);

const Latitude = observer(
  ({
    point,
    onChange,
  }: {
    point?: Coordinate;
    onChange: (newValue: Coordinate) => void;
  }): JSX.Element => {
    return (
      <>
        <input
          value={point ? toLonLat(point)[1].toFixed(2) : 0}
          type="number"
          step="0.01"
          min="0"
          max="90"
          onChange={(e) => {
            let value = parseFloat(e.target.value);
            value = !value || value > 90 || value < 0 ? 0 : value;
            onChange(fromLonLat([point ? toLonLat(point)[0] : 0, value]));
          }}
        />
        N
      </>
    );
  }
);

const Longitude = observer(
  ({
    point,
    onChange,
  }: {
    point?: Coordinate;
    onChange: (newValue: Coordinate) => void;
  }): JSX.Element => {
    return (
      <>
        <input
          value={point ? toLonLat(point)[0].toFixed(2) : 0}
          type="number"
          step="0.01"
          min="0"
          max="180"
          onChange={(e) => {
            let value = parseFloat(e.target.value);
            value = !value || value > 180 || value < 0 ? 0 : value;
            onChange(fromLonLat([value, point ? toLonLat(point)[1] : 0]));
          }}
        />
        E
      </>
    );
  }
);

export default CoordinatePoint;
