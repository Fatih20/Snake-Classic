<script lang="ts">
  import { gridSize, refreshTime } from "../config";
  import {
    cellCoordinate,
    directionVectorType,
    makePossibleCoordinate,
    possibleCoordinateType,
    possibleDirection,
  } from "../utilities/types";
  import {
    randomCoordinate,
    randomDirection,
    directionsProperty,
    oppositeDirectionDictionary,
    allCoordinateMaker,
    randomUniqueCoordinateGenerator,
  } from "../utilities/utilities";

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

  $: randomUniqueCoordinateList = randomUniqueCoordinateGenerator(
    wholeSnakeCoordinateList,
    allCoordinateList,
    3
  );

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
    headCoordinate: cellCoordinate,
    bodyAndTailCoordinateList: cellCoordinate[]
  ) {
    return bodyAndTailCoordinateList.map((coordinate, index) => {
      if (index === 0) {
        return headCoordinate;
      } else {
        return bodyAndTailCoordinateList[index - 1];
      }
    });
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

  setInterval(() => {
    bodyAndTailCoordinateList = bodyAndTailCoordinateUpdater(
      headCoordinate,
      bodyAndTailCoordinateList
    );
    headCoordinate = mover(headCoordinate, directionVector);
    console.log(
      randomUniqueCoordinateGenerator(
        wholeSnakeCoordinateList,
        allCoordinateList,
        3
      )
    );
  }, refreshTime);
</script>

<svelte:window on:keydown={handleKeydown} />

<main>
  <div
    class="grid-container"
    style:grid-template-rows={gridRowColumnString}
    style:grid-template-columns={gridRowColumnString}
  >
    {#each wholeSnakeCoordinateList as coordinate (`${coordinate.x} ${coordinate.y}`)}
      <div
        class="cell"
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
    {#each randomUniqueCoordinateList as coordinate (`${coordinate.x} ${coordinate.y}`)}
      <div
        class="cell"
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

  .cell {
    background-color: yellow;
    border: solid 1px black;
  }
</style>
