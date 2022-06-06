import { cellCoordinate, directionVectorType, makePossibleCoordinate, direction, possibleDirection, makePossibleVectorValue } from "./types";
import { directionsProperty, oppositeDirectionDictionary, randomizeFrom0ToNMinus1, randomizeFrom1ToN } from "./utilities";
import { gridSize } from "../config";

export function mover(
    movedCoordinate: cellCoordinate,
    { x: incrementX, y: incrementY }: directionVectorType,
    multiplier : number = 1
  ): cellCoordinate {
    let newX = movedCoordinate.x + incrementX * multiplier;
    let newY = movedCoordinate.y + incrementY * multiplier;
    if (newX > gridSize) {
      newX = 1;
    } else if (newX < 1) {
      newX = gridSize;
    }

    if (newY > gridSize) {
      newY = 1;
    } else if (newY < 1) {
      newY = gridSize;
    }

    return { x: makePossibleCoordinate(newX), y: makePossibleCoordinate(newY) };
  }

  export function wholeSnakeCoordinateListInitialGenerator(
    headCoordinate: cellCoordinate,
    direction: direction,
    length : number
  ) {
    const oppositeDirectionVector = directionsProperty[oppositeDirectionDictionary[direction]].vectorValue;
    return [headCoordinate, ...Array.from({length : length - 1}, (_, i) => mover(headCoordinate, oppositeDirectionVector, i + 1))]
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
        if (!filledCoordinateStringifiedSet.has(coordinate)) {
            emptyCoordinateSet.add(JSON.parse(coordinate));
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

export function positionRelativeTo ({x : xFrom, y : yFrom} : cellCoordinate, {x : xTo, y : yTo} : cellCoordinate) {
    const incrementX = xTo - xFrom;
    const incrementY = yTo - yFrom;
    let directionVectorOneToTwo : directionVectorType;
    
    if (incrementX < -1) {
        directionVectorOneToTwo = {x : makePossibleVectorValue(1), y : makePossibleVectorValue(0)}    
    } else if (incrementX > 1) {
        directionVectorOneToTwo = {x : makePossibleVectorValue(-1), y : makePossibleVectorValue(0)}
    } else if (incrementY < -1) {
        directionVectorOneToTwo = {x : makePossibleVectorValue(0), y : makePossibleVectorValue(1)}    
    } else if (incrementY > 1) {
        directionVectorOneToTwo = {x : makePossibleVectorValue(0), y : makePossibleVectorValue(-1)}
    } else {
    directionVectorOneToTwo = {x : makePossibleVectorValue(incrementX), y : makePossibleVectorValue(incrementY)}}

    return Object.keys(directionsProperty).filter((directionName : direction) =>
        JSON.stringify(directionsProperty[directionName].vectorValue) === JSON.stringify(directionVectorOneToTwo))[0] as direction;
}

export function wholeSnakeCoordinateListUpdater(
    wholeSnakeCoordinateList: cellCoordinate[],
    directionVector : directionVectorType,
    howManyTail: number = 0
  ) {
    wholeSnakeCoordinateList.unshift(mover(wholeSnakeCoordinateList[0], directionVector))
    wholeSnakeCoordinateList.pop()

    const tailDirection = positionRelativeTo(
      wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 2],
      wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 1]
    );
    const directionVectorFromLastTail =
      directionsProperty[tailDirection].vectorValue;
    const newTailCoordinateList = Array.from({length : howManyTail}, (_, i) => {
      return mover(wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 1], directionVectorFromLastTail, i + 1)
    })
    return [
      ...wholeSnakeCoordinateList,
      ...newTailCoordinateList,
    ];
}

export function cornerOfSnakeBodyGenerator(wholeSnakeCoordinateList: cellCoordinate[]) {
    return wholeSnakeCoordinateList.map((snakeCoordinate, index) => {
      if (index === 0 || index === wholeSnakeCoordinateList.length - 1) {
        const comparedCell =
          index === 0
            ? wholeSnakeCoordinateList[1]
            : wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 2];
        const directionFromNextCoordinate = positionRelativeTo(
          comparedCell,
          snakeCoordinate
        );

        return `${directionFromNextCoordinate.toLowerCase()}`;
      } else {
        const previousCell = wholeSnakeCoordinateList[index - 1];
        const nextCell = wholeSnakeCoordinateList[index + 1];
        const directionFromPreviousCell = positionRelativeTo(
          previousCell,
          snakeCoordinate
        ) as direction;
        const directionFromNextCell = positionRelativeTo(
          nextCell,
          snakeCoordinate
        ) as direction;
        return (oppositeDirectionDictionary[directionFromPreviousCell] ===
          directionFromNextCell ? `` : `${directionFromPreviousCell.toLowerCase()}-${directionFromNextCell.toLowerCase()}`)
      }
    });
}

export function checkIfHeadBiteBody(wholeSnakeCoordinateList: cellCoordinate[]) {
  const { x: headX, y: headY } = wholeSnakeCoordinateList[0];
    return wholeSnakeCoordinateList.slice(1).some(({x : bodyX, y : bodyY}) => (headX === bodyX && headY === bodyY)
    );
}