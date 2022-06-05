import { blankSavedGame, cellCoordinate, direction, directionVectorType, ISavedGameInfo, ISavedGameNone, ISavedGameProperty, makePossibleCoordinate, makePossibleVectorValue, oppositeDirectionDictionaryType } from "./types";
import { gridSize } from "../config";
import { possibleDirection, directionsPropertyType,
    possibleDirectionKey,
    possibleDirectionVector, } from "./types";

export function randomizeFrom1ToN (N : number) {
    return Math.floor(Math.random() * N) + 1
}

export function randomizeFrom0ToNMinus1 (N : number) {
    return Math.floor(Math.random() * N)
}



export const directionsProperty: directionsPropertyType = {
    Up: {
      keyList: possibleDirectionKey[0],
      vectorValue: possibleDirectionVector[0],
    },
    Down: {
      keyList: possibleDirectionKey[1],
      vectorValue: possibleDirectionVector[1],
    },
    Right: {
      keyList: possibleDirectionKey[2],
      vectorValue: possibleDirectionVector[2],
    },
    Left: {
      keyList: possibleDirectionKey[3],
      vectorValue: possibleDirectionVector[3],
    },
  };

export const oppositeDirectionDictionary : oppositeDirectionDictionaryType = {
    "Up" : "Down",
    "Down" : "Up",
    "Left" : "Right",
    "Right" : "Left"
}

export function allCoordinateMaker (gridSize : number) {
    let allCoordinateList = [] as cellCoordinate[];
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            allCoordinateList.push({x : makePossibleCoordinate(i), y : makePossibleCoordinate(j)})
        }
    }
    return allCoordinateList;
}

export function fetchItemFromLocalStorage (key : string){
    let candidateResult = localStorage.getItem(key);
    if (candidateResult !== undefined && candidateResult !== null) {
        return JSON.parse(candidateResult)
    } else {
        return undefined
    }
}

export function isSavedGameUndefined(savedGame : ISavedGameNone | ISavedGameInfo) {
    return (JSON.stringify(savedGame) === JSON.stringify(blankSavedGame))
}

