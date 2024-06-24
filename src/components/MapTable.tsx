import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Coordinate } from "ol/coordinate";
import { CoordinatePoint } from "./CoordinatePoint";
import { EditButtons } from "./EditButtons";
import { mapStore } from "./MapStore";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { Sector } from "./Sector";
import { offset } from "ol/sphere";
import { fromLonLat, toLonLat } from "ol/proj";
import { toRadians } from "ol/math";
import "./MapTable.css";

export const MeasureTable = observer((): JSX.Element => {
  if (mapStore.sectors.length === 0) {
    return <></>;
  }

  return (
    <div className="measure-table">
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
                  mapStore.isHoverActive && mapStore.hoverSectorId === sectorId
                    ? "hovered-row"
                    : ""
                }
              >
                <td>{index + 1}.</td>
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
          <input
            type="number"
            value={sector.azimuthInDeg.toFixed(0)}
            onChange={(e) => {
              const coordinate = offset(
                toLonLat(sector.startPoint),
                sector.distanceInKm * 1000,
                toRadians(parseFloat(e.target.value))
              );

              runInAction(() => {
                sector.endPoint = fromLonLat(coordinate);

                if (sector.nextSector) {
                  sector.nextSector.startPoint = fromLonLat(coordinate);
                }
              });
            }}
          />
        ) : (
          <>{sector.azimuthInDeg.toFixed(0)}</>
        )}
        °
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
          <input
            type="number"
            value={sector.distanceInKm.toFixed(2)}
            onChange={(e) => {
              const coordinate = offset(
                toLonLat(sector.startPoint),
                parseFloat(e.target.value) * 1000,
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
        ) : (
          <>{sector.distanceInKm.toFixed(2)} </>
        )}
        km
      </span>
    );
  }
);

const Angle = ({
  sector,
}: {
  sector: Sector;
  isEditing: boolean;
}): JSX.Element => {
  return (
    <span className="angle">
      {sector.angleBetweenPrevious?.toFixed(0).concat("°") ?? "–"}
    </span>
  );
};
