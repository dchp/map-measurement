import { makeAutoObservable } from "mobx";
import { Coordinate } from "ol/coordinate";
import { toLonLat } from "ol/proj";
import { getDistance } from "ol/sphere";
import { getAzimuthInDeg, getLinesAngleInDeg } from "../utils/geometry";

export class Sector {
  id: string;
  startPoint: Coordinate;
  endPoint: Coordinate;
  previousSector?: Sector;
  nextSector?: Sector;

  constructor(
    startPoint: Coordinate,
    endPoint: Coordinate,
    previousSector?: Sector,
    nextSector?: Sector
  ) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.previousSector = previousSector;
    this.nextSector = nextSector;
    this.id = (Date.now() + Math.random()).toString();
    makeAutoObservable(this);
  }

  get azimuthInDeg() {
    if (!this.startPoint || !this.endPoint) {
      return 0;
    }
    return getAzimuthInDeg(toLonLat(this.startPoint), toLonLat(this.endPoint));
  }

  get distanceInKm() {
    if (!this.startPoint || !this.endPoint) {
      return 0;
    }
    return getDistance(toLonLat(this.startPoint), toLonLat(this.endPoint));
  }

  get angleBetweenPrevious() {
    if (!this.previousSector || !this.startPoint || !this.endPoint)
      return undefined;

    return getLinesAngleInDeg(
      [this.previousSector.startPoint!, this.previousSector.endPoint!],
      [this.startPoint, this.endPoint]
    );
  }
}
