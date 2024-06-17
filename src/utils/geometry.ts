import LatLonSpherical from "geodesy/latlon-spherical";
import { Coordinate } from "ol/coordinate";
import { toLonLat } from "ol/proj";

export function getAzimuthInDeg(start: Coordinate, end: Coordinate): number {
  const [startLon, startLat] = toLonLat(start);
  const [endLon, endLat] = toLonLat(end);

  const point1 = new LatLonSpherical(startLat, startLon);
  const point2 = new LatLonSpherical(endLat, endLon);

  return point1.initialBearingTo(point2);
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
