import { makeAutoObservable } from "mobx";
import LengthUnit from "../types/LengthUnit";
import AngleUnit from "../types/AngleUnit";

class UnitSettingStore {
  lengthUnit = LengthUnit.Kilometers;
  angleUnit = AngleUnit.Degrees;

  constructor() {
    makeAutoObservable(this);
  }
}

export const unitSettingStore = new UnitSettingStore();
