import { cellCoordinate, makePossibleCoordinate, oppositeDirectionDictionaryType } from "./types";
import { gridSize } from "../config";
import { possibleDirection, directionsPropertyType,
    possibleDirectionKey,
    possibleDirectionVector, } from "./types";

function randomizeFrom1ToN (N : number) {
    return Math.floor(Math.random() * N) + 1
}

function randomizeFrom0ToNMinus1 (N : number) {
    return Math.floor(Math.random() * N)
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

export const oppositeDirectionDictionary : oppositeDirectionDictionaryType = {
    "Up" : "Down",
    "Down" : "Up",
    "Left" : "Right",
    "Right" : "Left"
}

function setDifference (set1 : Set<any>, set2 : Set<any>){
    let differenceSet = new Set()
    set1.forEach((element) => 
    {
        if (!set2.has(element)) {
            differenceSet.add(element)
        }
    }
    )

    return differenceSet;
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

export function randomUniqueCoordinateGenerator (filledCoordinateList : cellCoordinate[], allCoordinateList : cellCoordinate[], numberOfCoordinate : number) {
    const filledCoordinateSet = new Set(filledCoordinateList);
    const allCoordinateSet = new Set(allCoordinateList);

    let emptyCoordinateSet = new Set<cellCoordinate>();

    allCoordinateSet.forEach((coordinate) => {
        if (!filledCoordinateSet.has(coordinate)) {
            emptyCoordinateSet.add(coordinate);
        }
    });

    let emptyCoordinateList = Array.from(emptyCoordinateSet);

    if (numberOfCoordinate >= emptyCoordinateList.length) {
        return [] as cellCoordinate[]
    } else {
        let randomUniqueCoordinateList = [] as cellCoordinate[];
        for (let i = 0; i < numberOfCoordinate; i++) {
            const randomIndex = randomizeFrom0ToNMinus1(emptyCoordinateList.length);
            randomUniqueCoordinateList.push(emptyCoordinateList[randomIndex])
            emptyCoordinateList.splice(randomIndex, 1);
        }
        return randomUniqueCoordinateList;
    }
}

