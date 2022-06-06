import { cellCoordinate, directionVectorType, makePossibleCoordinate, direction, possibleDirection, makePossibleVectorValue } from "./types";
import { directionsProperty, oppositeDirectionDictionary, randomizeFrom0ToNMinus1, randomizeFrom1ToN } from "./utilities";
import { gridSize } from "../config";

export function mover(
    movedCoordinate: cellCoordinate,
    directionVector: directionVectorType,
    multiplier : number = 1
  ): cellCoordinate {
      const { x: incrementX, y: incrementY } = directionVector;
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

export function positionRelativeTo (coordinateFrom : cellCoordinate, coordinateTo : cellCoordinate) {
    const {x : xFrom, y : yFrom} = coordinateFrom;
    const {x : xTo, y : yTo} = coordinateTo;

    const incrementX = xTo - xFrom;
    const incrementY = yTo - yFrom;
    let directionVectorOneToTwo : directionVectorType;
    // console.log(Math.abs(incrementX) / incrementX);
    // console.log(incrementY);
    // console.log(Math.abs(incrementY) / incrementY);
    // let directionVectorOneToTwo : directionVectorType = {
    //     x : makePossibleVectorValue(incrementX !== 0 ? Math.abs(incrementX) / incrementX : 0),
    //     y : makePossibleVectorValue(incrementY !== 0 ? Math.abs(incrementY) / incrementY : 0)
    // };
    
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
    // const result = Object.keys(directionsProperty).filter((directionName : direction) => {
    //     console.log(directionVectorOneToTwo);
    //     console.log(directionsProperty[directionName].vectorValue);
    //     return JSON.stringify(directionsProperty[directionName].vectorValue) === JSON.stringify(directionVectorOneToTwo)});

    // console.log(result);

    return Object.keys(directionsProperty).filter((directionName : direction) =>
        JSON.stringify(directionsProperty[directionName].vectorValue) === JSON.stringify(directionVectorOneToTwo))[0] as direction;

    // let returnedDirection : direction = "Up";
    // Object.keys(directionsProperty).forEach((directionName : direction) => {
    //     const candidatedirectionVector = directionsProperty[directionName].vectorValue
    //     const {x : referenceX, y : referenceY} = candidatedirectionVector;
    //     if (directionVectorOneToTwo.x === referenceX && directionVectorOneToTwo.y === referenceY) {
    //         returnedDirection = directionName;
    //     }
    // })

    // return returnedDirection;
}

export function wholeSnakeCoordinateListUpdater(
    wholeSnakeCoordinateList: cellCoordinate[],
    directionVector : directionVectorType,
    addNewTail: boolean,
    howManyTail: number = 0
  ) {
    const initialHeadCoordinate = wholeSnakeCoordinateList[0];
    const newheadCoordinate = mover(initialHeadCoordinate, directionVector);
    const newBodyCoordinateList = wholeSnakeCoordinateList
      .slice(1)
      .map((coordinate, index) => {
        return wholeSnakeCoordinateList[index];
      });

    let newTailCoordinateList = [] as cellCoordinate[];
    if (addNewTail) {
      const tailDirection = positionRelativeTo(
        wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 2],
        wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 1]
      );
      const directionVectorFromLastTail =
        directionsProperty[tailDirection].vectorValue;
      let lastTail = newBodyCoordinateList[newBodyCoordinateList.length - 1];
      for (let i = 0; i < howManyTail; i++) {
        let newTail = mover(lastTail, directionVectorFromLastTail);
        newTailCoordinateList.push(newTail);
        lastTail = newTailCoordinateList[newTailCoordinateList.length - 1];
      }
    }
    return [
      newheadCoordinate,
      ...newBodyCoordinateList,
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

        console.log(directionFromNextCoordinate);

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
        console.log([directionFromPreviousCell, directionFromNextCell]);
        if (
          oppositeDirectionDictionary[directionFromPreviousCell] ===
          directionFromNextCell
        ) {
          return ``;
        } else {
          return `${directionFromPreviousCell.toLowerCase()}-${directionFromNextCell.toLowerCase()}`;
        }
      }
    });
}

export function checkIfHeadBiteBody(wholeSnakeCoordinateList: cellCoordinate[]) {
    const headCoordinate = wholeSnakeCoordinateList[0];
    const bodyCoordinateList = wholeSnakeCoordinateList.slice(1);
    const { x: referenceX, y: referenceY } = headCoordinate;
    let headBiteBody = false;
    bodyCoordinateList.forEach((bodyAndTailCoordinate) => {
        const { x: comparedX, y: comparedY } = bodyAndTailCoordinate;
        if (referenceX === comparedX && referenceY === comparedY) {
        headBiteBody = true;
        }
    });
    return headBiteBody;
}