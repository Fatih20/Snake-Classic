<script lang="ts">
  import {
    gridSize,
    numberOfFruitSpawned,
    numberOfTailAddedAfterEating,
    refreshTime,
    turnIntervalBetweenFruitSpawn,
  } from "../../config";
  import {
    cellCoordinate,
    directionVectorType,
    makePossibleCoordinate,
    possibleCoordinateType,
    possibleDirection,
  } from "../../utilities/types";
  import {
    randomCoordinate,
    randomDirection,
    directionsProperty,
    oppositeDirectionDictionary,
    allCoordinateMaker,
    randomUniqueCoordinateGenerator,
    positionRelativeTo,
  } from "../../utilities/utilities";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const cellSize = "10px";

  const gridRowColumnString = `repeat(${gridSize}, ${cellSize})`;

  let allCoordinateList = allCoordinateMaker(gridSize);
  let direction = randomDirection();
  let oppositeDirection = oppositeDirectionDictionary[direction];
  let directionVector = directionsProperty[direction].vectorValue;
  let oppositeDirectionVector =
    directionsProperty[oppositeDirection].vectorValue;

  $: oppositeDirection = oppositeDirectionDictionary[direction];
  $: directionVector = directionsProperty[direction].vectorValue;
  $: oppositeDirectionVector =
    directionsProperty[oppositeDirection].vectorValue;

  let headCoordinate: cellCoordinate = randomCoordinate();
  let length = 7;
  let bodyAndTailCoordinateList =
    bodyAndTailCoordinateInitialGenerator(headCoordinate);
  let wholeSnakeCoordinateList = [headCoordinate, ...bodyAndTailCoordinateList];
  $: wholeSnakeCoordinateList = [headCoordinate, ...bodyAndTailCoordinateList];

  let allFruitEaten = false;
  let fruitCoordinateList = randomUniqueCoordinateGenerator(
    wholeSnakeCoordinateList,
    allCoordinateList,
    numberOfFruitSpawned
  );
  $: allFruitEaten = fruitCoordinateList.length === 0;
  $: {
    if (allFruitEaten && nthTurnReference === turnIntervalBetweenFruitSpawn) {
      fruitCoordinateList = randomUniqueCoordinateGenerator(
        wholeSnakeCoordinateList,
        allCoordinateList,
        numberOfFruitSpawned
      );
      nthTurnReference = 0;
      allFruitEaten = false;
    }
  }

  let nthTurnReference = 0;

  let gameOver = false;

  function bodyAndTailCoordinateInitialGenerator(
    headCoordinate: cellCoordinate
  ) {
    let bodyAndTailCoordinateList: cellCoordinate[] = [];
    let referenceCoordinate = headCoordinate;
    for (let i = 0; i < length; i++) {
      if (i !== 0) {
        referenceCoordinate = bodyAndTailCoordinateList[i - 1];
      }

      bodyAndTailCoordinateList.push(
        mover(referenceCoordinate, oppositeDirectionVector)
      );
    }

    return bodyAndTailCoordinateList;
  }

  function bodyAndTailCoordinateUpdater(
    wholeSnakeCoordinateList: cellCoordinate[],
    addNewTail: boolean,
    howManyTail: number = 0
  ) {
    let newBodyAndTailCoordinateList = wholeSnakeCoordinateList
      .slice(1)
      .map((coordinate, index) => {
        if (index === 0) {
          return headCoordinate;
        } else {
          return bodyAndTailCoordinateList[index - 1];
        }
      });

    let newTailCoordinateList = [] as cellCoordinate[];
    if (addNewTail) {
      const tailDirection = positionRelativeTo(
        wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 2],
        wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 1]
      );
      const directionVectorFromLastTail =
        directionsProperty[tailDirection].vectorValue;
      let lastTail =
        newBodyAndTailCoordinateList[newBodyAndTailCoordinateList.length - 1];
      for (let i = 0; i < howManyTail; i++) {
        let newTail = mover(lastTail, directionVectorFromLastTail);
        newTailCoordinateList.push(newTail);
        lastTail = newTailCoordinateList[newTailCoordinateList.length - 1];
      }
    }

    return [...newBodyAndTailCoordinateList, ...newTailCoordinateList];
  }

  function mover(
    movedCoordinate: cellCoordinate,
    directionVector: directionVectorType
  ) {
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

  function handleKeydown(e) {
    const { key } = e;
    const keyPressed = key.toUpperCase();
    Object.values(directionsProperty).forEach(({ key }, index) => {
      if (
        keyPressed === key &&
        keyPressed !== directionsProperty[oppositeDirection].key
      ) {
        direction = possibleDirection[index];
      }
    });
  }

  function checkIfHeadBiteBody(
    headCoordinate: cellCoordinate,
    bodyAndTailCoordinateList: cellCoordinate[]
  ) {
    const { x: referenceX, y: referenceY } = headCoordinate;
    let headBiteBody = false;
    bodyAndTailCoordinateList.forEach((bodyAndTailCoordinate) => {
      const { x: comparedX, y: comparedY } = bodyAndTailCoordinate;
      if (referenceX === comparedX && referenceY === comparedY) {
        headBiteBody = true;
        // console.log("You lost");
      }
    });
    return headBiteBody;
  }

  function sendFruitEatenData() {
    dispatch("justAteFruit", {
      text: "Fruit eaten increased",
    });
  }

  const mainEventLoop = setInterval(() => {
    let justAteFruit = false;
    fruitCoordinateList.forEach((fruitCoordinate, indexOuter) => {
      if (JSON.stringify(fruitCoordinate) === JSON.stringify(headCoordinate)) {
        justAteFruit = true;
        sendFruitEatenData();
        fruitCoordinateList = fruitCoordinateList.filter(
          (fruitCoordinate, indexInner) => {
            return indexInner !== indexOuter;
          }
        );
      }
    });
    bodyAndTailCoordinateList = bodyAndTailCoordinateUpdater(
      wholeSnakeCoordinateList,
      justAteFruit,
      numberOfTailAddedAfterEating
    );
    headCoordinate = mover(headCoordinate, directionVector);

    if (allFruitEaten) {
      nthTurnReference += 1;
    }

    if (checkIfHeadBiteBody(headCoordinate, bodyAndTailCoordinateList)) {
      gameOver = true;
    }

    if (gameOver) {
      clearInterval(mainEventLoop);
    }

    // console.log("Game is running");
  }, refreshTime);
</script>

<svelte:window on:keydown={handleKeydown} />

<main>
  <div
    class="grid-container"
    style:grid-template-rows={gridRowColumnString}
    style:grid-template-columns={gridRowColumnString}
  >
    {#each fruitCoordinateList as coordinate (`${coordinate.x} ${coordinate.y}`)}
      <div
        class="fruit"
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
    {#each bodyAndTailCoordinateList as coordinate (`${coordinate.x} ${coordinate.y}`)}
      <div
        class="snake-body"
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
    {#each [headCoordinate] as coordinate (`${coordinate.x} ${coordinate.y}`)}
      <div
        class="snake-head"
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
  </div>
</main>

<style>
  .grid-container {
    box-sizing: border-box;
    display: grid;
    border: solid 1px black;
    margin: 0;
    padding: 0;
    gap: 0;
  }

  .snake-head {
    background-color: black;
  }

  .snake-body {
    background-color: red;
  }

  .fruit {
    background-color: green;
  }
</style>
