import { makeAutoObservable } from "mobx";

export enum LengthUnit {
  Kilometers = "km",
  Miles = "mi",
}

export enum AngleUnit {
  Degrees = "°",
  Radians = "rad",
}

class UnitSettingStore {
  lengthUnit = LengthUnit.Kilometers;
  angleUnit = AngleUnit.Degrees;

  constructor() {
    makeAutoObservable(this);
  }
}

export const unitSettingStore = new UnitSettingStore();
