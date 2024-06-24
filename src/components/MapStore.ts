import { makeAutoObservable, runInAction } from "mobx";
import { Coordinate } from "ol/coordinate";
import { Sector } from "./Sector";

class MapStore {
  sectors: Sector[] = [];
  hoverSectorId = "";
  editSectorId = "";
  startPoint: Coordinate | undefined;
  isEditing = false;
  isDraggedByPoint = false;

  get endPoint(): Coordinate | undefined {
    if (this.lastSector) {
      return this.lastSector.endPoint;
    }
    return this.startPoint;
  }

  get isHoverActive(): boolean {
    return !this.isDraggedByPoint && !this.isEditing;
  }

  get lastSector() {
    return this.sectors.length >= 1
      ? this.sectors[this.sectors.length - 1]
      : undefined;
  }

  constructor() {
    makeAutoObservable(this);
  }

  addPoint(point: Coordinate) {
    runInAction(() => {
      if (!this.startPoint) {
        this.startPoint = point;
        mapStore.isEditing = true;
        return;
      }

      this.addSector(this.endPoint!, point, this.lastSector);
      mapStore.isEditing = true;
    });
  }

  setStartPoint(point: Coordinate) {
    runInAction(() => {
      mapStore.startPoint = point;
      if (this.sectors.length > 0) {
        this.sectors[0].startPoint = point;
      }
    });
  }

  addSector(
    startPoint: Coordinate,
    endPoint: Coordinate,
    previousSector: Sector | undefined
  ) {
    const newSector = new Sector(startPoint, endPoint, previousSector);
    if (this.lastSector) {
      this.lastSector.nextSector = newSector;
    }
    this.sectors.push(newSector);

    return newSector;
  }

  removeSector(sectorId: string) {
    const sectorToRemove = this.sectors.find(
      (sector) => sector.id === sectorId
    );
    const previousSector = sectorToRemove?.previousSector;
    const nextSector = sectorToRemove?.nextSector;

    var newSectors = this.sectors.reduce((processedSectors, sector) => {
      if (sector.id !== sectorId) {
        switch (sector.id) {
          case previousSector?.id:
            sector.nextSector = nextSector;
            break;
          case nextSector?.id:
            sector.startPoint = previousSector?.endPoint ?? this.startPoint!;
            sector.previousSector = previousSector;
            break;
        }
        processedSectors.push(sector);
      }
      return processedSectors;
    }, [] as Sector[]);

    this.sectors = newSectors;
  }

  clean() {
    runInAction(() => {
      this.isEditing = false;
      this.sectors = [];
      this.startPoint = undefined;
    });
  }
}

export const mapStore = new MapStore();
