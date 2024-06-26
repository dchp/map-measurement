import "./MeasureTable.scss";

import { Coordinate } from "ol/coordinate";
import { offset } from "ol/sphere";
import { fromLonLat, toLonLat } from "ol/proj";
import { toRadians } from "ol/math";
import CoordinatePoint from "./CoordinatePoint";
import EditButtons from "./EditButtons";
import mapStore from "./MapStore";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import Sector from "./Sector";
import { unitSettingStore } from "./UnitSettingStore";
import LengthUnit from "../types/LengthUnit";
import { convertMilesToKm } from "../utils/geometry";
import AngleUnit from "../types/AngleUnit";

const MeasureTable = observer((): JSX.Element => {
  return (
    <div className="measure-table">
      {mapStore.sectors.length === 0 ? (
        <></>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="column-id"></th>
              <th className="column-distance">Distance</th>
              <th className="column-azimuth">Azimuth</th>
              <th className="column-angle">Angle</th>
              <th className="column-endpoint">End point</th>
              <th className="column-actions"></th>
            </tr>
          </thead>
          <tbody>
            {mapStore.sectors.map((sector, index) => {
              const sectorId = sector.id;
              return (
                <tr
                  key={sectorId}
                  onMouseEnter={() =>
                    runInAction(() => {
                      mapStore.hoverSectorId = sectorId;
                    })
                  }
                  onMouseLeave={() =>
                    runInAction(() => {
                      mapStore.hoverSectorId = "";
                    })
                  }
                  className={
                    mapStore.isHoverActive &&
                    mapStore.hoverSectorId === sectorId
                      ? "hovered-row"
                      : ""
                  }
                >
                  <td>{index + 1}</td>
                  <td>
                    <Distance
                      sector={sector}
                      isEditing={mapStore.editSectorId === sectorId}
                    />
                  </td>
                  <td>
                    <Azimuth
                      sector={sector}
                      isEditing={mapStore.editSectorId === sectorId}
                    />
                  </td>
                  <td>
                    <Angle
                      sector={sector}
                      isEditing={mapStore.editSectorId === sectorId}
                    />
                  </td>
                  <td className="end-point">
                    <CoordinatePoint
                      point={sector.endPoint}
                      isEditing={mapStore.editSectorId === sectorId}
                      onChange={(coordinate: Coordinate) => {
                        const editedSector = mapStore.sectors.find(
                          (s) => s.id === sectorId
                        );
                        if (!editedSector) {
                          return;
                        }
                        runInAction(() => {
                          editedSector.endPoint = coordinate;

                          if (editedSector.nextSector) {
                            editedSector.nextSector.startPoint = coordinate;
                          }
                        });
                      }}
                    />
                  </td>
                  <td>
                    <EditButtons
                      isEditing={sector.id === mapStore.editSectorId}
                      onEditingChange={(isEditing) =>
                        runInAction(() => {
                          mapStore.editSectorId = isEditing ? sectorId : "";
                        })
                      }
                      onRemove={() => mapStore.removeSector(sectorId)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
});

const Azimuth = observer(
  ({
    sector,
    isEditing,
  }: {
    sector: Sector;
    isEditing: boolean;
  }): JSX.Element => {
    return (
      <span className="azimuth">
        {isEditing ? (
          <span>
            <input
              type="number"
              value={sector.azimuth.fixedValue}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                value = !value || value >= 360 || value < 0 ? 0 : value;

                const coordinate = offset(
                  toLonLat(sector.startPoint),
                  sector.distanceInKm * 1000,
                  unitSettingStore.angleUnit === AngleUnit.Radians
                    ? value
                    : toRadians(value)
                );

                runInAction(() => {
                  sector.endPoint = fromLonLat(coordinate);

                  if (sector.nextSector) {
                    sector.nextSector.startPoint = fromLonLat(coordinate);
                  }
                });
              }}
            />
            {sector.azimuth.unit}
          </span>
        ) : (
          <>{sector.azimuth.tostring()}</>
        )}
      </span>
    );
  }
);

const Distance = observer(
  ({
    sector,
    isEditing,
  }: {
    sector: Sector;
    isEditing: boolean;
  }): JSX.Element => {
    return (
      <span className="distance">
        {isEditing ? (
          <span>
            <input
              type="number"
              value={sector.distance.fixedValue}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                value = !value || value > 10000 || value < 0 ? 0 : value;

                const coordinate = offset(
                  toLonLat(sector.startPoint),
                  unitSettingStore.lengthUnit === LengthUnit.Kilometers
                    ? value * 1000
                    : convertMilesToKm(value) * 1000,
                  toRadians(sector.azimuthInDeg)
                );

                runInAction(() => {
                  sector.endPoint = fromLonLat(coordinate);

                  if (sector.nextSector) {
                    sector.nextSector.startPoint = fromLonLat(coordinate);
                  }
                });
              }}
            />
            {sector.distance.unit}
          </span>
        ) : (
          <>{sector.distance.tostring()}</>
        )}
      </span>
    );
  }
);

const Angle = observer(
  ({ sector }: { sector: Sector; isEditing: boolean }): JSX.Element => {
    return (
      <span className="angle">
        {sector.angleBetweenPrevious?.tostring() ?? "–"}
      </span>
    );
  }
);

export default MeasureTable;
