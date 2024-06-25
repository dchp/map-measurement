import { Coordinate } from "ol/coordinate";
import { toDegrees, toRadians } from "ol/math";
import { toLonLat } from "ol/proj";

export function getAzimuthInDeg(start: Coordinate, end: Coordinate): number {
  const distanceLon = toRadians(end[0]) - toRadians(start[0]);
  const startLatRad = toRadians(start[1]);
  const endLatRad = toRadians(end[1]);
  const y = Math.sin(distanceLon) * Math.cos(endLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(endLatRad) -
    Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(distanceLon);
  const azimuthDeg = toDegrees(Math.atan2(y, x));

  return azimuthDeg < 0 ? azimuthDeg + 360 : azimuthDeg;
}

export function getLinesAngleInDeg(
  line1: [Coordinate, Coordinate],
  line2: [Coordinate, Coordinate]
): number {
  const [start1, end1] = line1;
  const [start2, end2] = line2;

  const azimuth1 = getAzimuthInDeg(toLonLat(start1), toLonLat(end1));
  const azimuth2 = getAzimuthInDeg(toLonLat(start2), toLonLat(end2));

  let angle = Math.abs(azimuth2 - azimuth1);

  return angle > 180 ? 360 - angle : angle;
}

export function toGPSString(point: Coordinate): string {
  const [lon, lat] = toLonLat(point);

  return `${lat.toFixed(2)}N ${lon.toFixed(2)}E`;
}

export function convertKmToMiles(km: number): number {
  return km * 0.621371;
}
