import { cellCoordinate, directionVectorType, makePossibleCoordinate, direction, possibleDirection } from "./types";
import { directionsProperty, oppositeDirectionDictionary, randomizeFrom0ToNMinus1, randomizeFrom1ToN } from "./utilities";
import { gridSize } from "../config";

export function mover(
    movedCoordinate: cellCoordinate,
    directionVector: directionVectorType
  ): cellCoordinate {
    let newX: number;
    let newY: number;
    const { x: incrementX, y: incrementY } = directionVector;
    if (movedCoordinate.x + incrementX > gridSize) {
      newX = 1;
    } else if (movedCoordinate.x + incrementX < 1) {
      newX = gridSize;
    } else {
      newX = movedCoordinate.x + incrementX;
    }

    if (movedCoordinate.y + incrementY > gridSize) {
      newY = 1;
    } else if (movedCoordinate.y + incrementY < 1) {
      newY = gridSize;
    } else {
      newY = movedCoordinate.y + incrementY;
    }

    return { x: makePossibleCoordinate(newX), y: makePossibleCoordinate(newY) };
  }

  export function wholeSnakeCoordinateListInitialGenerator(
    headCoordinate: cellCoordinate,
    direction: direction,
    length : number
  ) {
    const oppositeDirectionVector =
      directionsProperty[oppositeDirectionDictionary[direction]].vectorValue;
    let referenceCoordinate = headCoordinate;
    let wholeSnakeCoordinateList: cellCoordinate[] = [headCoordinate];
    for (let i = 1; i < length; i++) {
      referenceCoordinate = wholeSnakeCoordinateList[i - 1];
      wholeSnakeCoordinateList.push(
        mover(referenceCoordinate, oppositeDirectionVector)
      );
    }

    return wholeSnakeCoordinateList;
  }

export function randomCoordinate () {
    return {x : makePossibleCoordinate(randomizeFrom1ToN(gridSize)), y : makePossibleCoordinate(randomizeFrom1ToN(gridSize))} as cellCoordinate;
}

export function randomDirection () {
    return possibleDirection[(randomizeFrom1ToN(4)-1)];
}

export function randomUniqueCoordinateGenerator (filledCoordinateList : cellCoordinate[], allCoordinateList : cellCoordinate[], numberOfCoordinate : number) {
    const filledCoordinateStringifiedSet = new Set(filledCoordinateList.map((coordinate) => JSON.stringify(coordinate)));
    const allCoordinateStringifiedSet = new Set(allCoordinateList.map((coordinate) => JSON.stringify(coordinate)));

    let emptyCoordinateSet = new Set<cellCoordinate>();

    allCoordinateStringifiedSet.forEach((coordinate) => {
        // This check probably doesn't work because every object is unique and can't be compared.
        if (!filledCoordinateStringifiedSet.has(coordinate)) {
            emptyCoordinateSet.add(JSON.parse(coordinate));
        }
    });

    let emptyCoordinateList = Array.from(emptyCoordinateSet);
    // console.log(emptyCoordinateList);

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