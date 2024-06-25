import { makeAutoObservable } from "mobx";
import { Coordinate } from "ol/coordinate";
import { toLonLat } from "ol/proj";
import { getDistance } from "ol/sphere";
import { toRadians } from "ol/math";
import {
  convertKmToMiles,
  getAzimuthInDeg,
  getLinesAngleInDeg,
} from "../utils/geometry";
import { unitSettingStore } from "./UnitSettingStore";
import MeasuredValue from "../types/MeasureValue";
import LengthUnit from "../types/LengthUnit";
import AngleUnit from "../types/AngleUnit";

class Sector {
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

  get azimuthInDeg(): number {
    return getAzimuthInDeg(toLonLat(this.startPoint), toLonLat(this.endPoint));
  }

  get azimuth(): MeasuredValue {
    return new MeasuredValue(
      unitSettingStore.angleUnit === AngleUnit.Degrees
        ? this.azimuthInDeg
        : toRadians(this.azimuthInDeg),
      unitSettingStore.angleUnit
    );
  }

  get distanceInKm() {
    return (
      getDistance(toLonLat(this.startPoint), toLonLat(this.endPoint)) / 1000
    );
  }

  get distanceInMi() {
    return convertKmToMiles(this.distanceInKm);
  }

  get distance(): MeasuredValue {
    return new MeasuredValue(
      unitSettingStore.lengthUnit === LengthUnit.Kilometers
        ? this.distanceInKm
        : this.distanceInMi,
      unitSettingStore.lengthUnit
    );
  }

  get angleBetweenPrevious(): MeasuredValue | undefined {
    if (!this.previousSector) return undefined;

    const angleInDeg = getLinesAngleInDeg(
      [this.previousSector.startPoint, this.previousSector.endPoint],
      [this.startPoint, this.endPoint]
    );

    return new MeasuredValue(
      unitSettingStore.angleUnit === AngleUnit.Degrees
        ? angleInDeg
        : toRadians(angleInDeg),
      unitSettingStore.angleUnit
    );
  }
}

export default Sector;
