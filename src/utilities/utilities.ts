import { cellCoordinate, makePossibleCoordinate } from "./types";
import { gridSize } from "../config";
import { possibleDirection, directionsPropertyType,
    possibleDirectionKey,
    possibleDirectionVector, } from "./types";

function randomizeFrom1ToN (N : number) {
    return Math.floor(Math.random() * N) + 1
}

export function randomCoordinate () {
    return {x : makePossibleCoordinate(randomizeFrom1ToN(gridSize)), y : makePossibleCoordinate(randomizeFrom1ToN(gridSize))} as cellCoordinate;
}

export function randomDirection () {
    return possibleDirection[(randomizeFrom1ToN(4)-1)];
}


export const directionsProperty: directionsPropertyType = {
    Up: {
      key: possibleDirectionKey[0],
      vectorValue: possibleDirectionVector[0],
    },
    Down: {
      key: possibleDirectionKey[1],
      vectorValue: possibleDirectionVector[1],
    },
    Right: {
      key: possibleDirectionKey[2],
      vectorValue: possibleDirectionVector[2],
    },
    Left: {
      key: possibleDirectionKey[3],
      vectorValue: possibleDirectionVector[3],
    },
  };
