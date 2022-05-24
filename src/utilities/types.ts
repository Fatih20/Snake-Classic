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

export const possibleDirection = ["Up", "Down", "Right", "Left"] as const;
export const possibleDirectionKey = ["W", "S", "D", "A"] as const;
export type direction = typeof possibleDirection[number];
export type directionKey = typeof possibleDirectionKey[number];

export function makePossibleVectorValue (candidateVectorValue : number) : directionVectorValue{
  if (candidateVectorValue >= -1 && candidateVectorValue <= 1) {
    return candidateVectorValue as directionVectorValue
  } else {
    throw new Error("This is not a valid direction vector value");
  }
}

export type directionVectorValue = number & {_type_ : "directionVectorValue"}

export type directionVectorTemplateType = {
  x : directionVectorValue,
  y : directionVectorValue
}

export const possibleDirectionVector = [
  {
    x : makePossibleVectorValue(0),
    y : makePossibleVectorValue(-1)
  },
  {
    x : makePossibleVectorValue(0),
    y : makePossibleVectorValue(1)
  },
  {
    x : makePossibleVectorValue(1),
    y : makePossibleVectorValue(0)
  },
  {
    x : makePossibleVectorValue(-1),
    y : makePossibleVectorValue(0)
  },
 ] as const

export type directionVectorType = typeof possibleDirectionVector[number];

interface directionPropertyType {
  key: directionKey,
  vectorValue : directionVectorType
}

export type directionsPropertyType = Record<direction, directionPropertyType>

// Direction is Up, Down, Right, Left
// DirectionVector is the element in possibleDirectionVector
// Direction key is "W", "S", "D", "A"

export type oppositeDirectionDictionaryType = Record<direction, direction>