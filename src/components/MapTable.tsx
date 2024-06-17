import "ol/ol.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Coordinate } from "ol/coordinate";
import { CoordinatePoint } from "./CoordinatePoint";
import { EditButtons } from "./EditButtons";
import { mapStore } from "./MapStore";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

export const MeasureTable = observer(
  ({
    editSectorId,
    setEditSectorId,
    hoverSectorId,
    setHoverSectorId,
  }: {
    editSectorId: string;
    setEditSectorId: React.Dispatch<React.SetStateAction<string>>;
    hoverSectorId: string;
    setHoverSectorId: React.Dispatch<React.SetStateAction<string>>;
  }): JSX.Element => {
    const headerNames = ["", "Distance", "Azimuth", "Angle", "End point", ""];

    if (mapStore.sectors.length === 0) {
      return <></>;
    }

    return (
      <div className="measure-table">
        <table className="table table-hover">
          <thead>
            <tr>
              {headerNames.map((name, index) => (
                <th scope="col" key={index}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mapStore.sectors.map((sector, index) => {
              const sectorId = sector.id;
              return (
                <tr
                  key={sectorId}
                  onMouseEnter={() => setHoverSectorId(sectorId)}
                  onMouseLeave={() => setHoverSectorId("")}
                  className={hoverSectorId === sectorId ? "hovered-row" : ""}
                >
                  <td>{index + 1}.</td>
                  <td>{sector.distanceInKm.toFixed(2)} km</td>
                  <td>{sector.azimuthInDeg.toFixed(0)}°</td>
                  <td>
                    {sector.angleBetweenPrevious?.toFixed(0).concat("°") ?? "–"}
                  </td>
                  <td className="end-point">
                    <CoordinatePoint
                      point={sector.endPoint}
                      isEditing={editSectorId === sectorId}
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
                      isEditing={sector.id === editSectorId}
                      onEditingChange={(isEditing) =>
                        setEditSectorId(isEditing ? sectorId : "")
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
  }
);
