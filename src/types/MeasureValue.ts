import { makeAutoObservable } from "mobx";
import AngleUnit from "./AngleUnit";
import LengthUnit from "./LengthUnit";

class MeasuredValue {
  value: number;
  unit: AngleUnit | LengthUnit;

  get unitSeparator() {
    return this.unit === AngleUnit.Degrees ? "" : " ";
  }

  get fixedValue() {
    const fractionDigits = this.unit === AngleUnit.Degrees ? 0 : 2;

    return this.value.toFixed(fractionDigits);
  }

  constructor(value: number, unit: AngleUnit | LengthUnit) {
    this.value = value;
    this.unit = unit;
    makeAutoObservable(this);
  }

  tostring() {
    return `${this.fixedValue}${this.unitSeparator}${this.unit}`;
  }
}

export default MeasuredValue;
