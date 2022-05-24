import { gridSize } from "../config";

export function makePossibleCoordinate(
    candidateCoordinate: number
  ): possibleCoordinateType {
    if (candidateCoordinate >= 1 && candidateCoordinate <= gridSize) {
      return candidateCoordinate as possibleCoordinateType;
    } else {
      throw new Error("The coordinate is not a valid coordinate");
    }
  }
export type possibleCoordinateType = number & { _type_: "possibleCoordinateType" };
export type cellCoordinate = {
    x: possibleCoordinateType,
    y : possibleCoordinateType
};