import { cellCoordinate, direction, directionVectorType, makePossibleCoordinate, makePossibleVectorValue, oppositeDirectionDictionaryType } from "./types";
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

export function positionRelativeTo (coordinate1 : cellCoordinate, coordinate2 : cellCoordinate) {
    const {x : x1, y : y1} = coordinate1;
    const {x : x2, y : y2} = coordinate2;
    const incrementX = makePossibleVectorValue(x2 - x1);
    const incrementY = makePossibleVectorValue(y2 - y1);
    const directionVectorOneToTwo = <directionVectorType>{x : incrementX, y : incrementY};
    console.log(directionVectorOneToTwo);
    let returnedDirection : direction = "Up";
    Object.keys(directionsProperty).forEach((directionName : direction) => {
        const candidatedirectionVector = directionsProperty[directionName].vectorValue
        console.log(candidatedirectionVector);
        const {x : referenceX, y : referenceY} = candidatedirectionVector;
        if (directionVectorOneToTwo.x === referenceX && directionVectorOneToTwo.y === referenceY) {
            console.log(directionVectorOneToTwo.x === referenceX)
            console.log(directionVectorOneToTwo.y === referenceY)
            returnedDirection = directionName;
        }
    })

    return returnedDirection;
}

