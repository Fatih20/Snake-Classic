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
  } from "../utilities/utilities";

  const cellSize = "10px";

  const gridRowColumnString = `repeat(${gridSize}, ${cellSize})`;

  // const arrayOfCoordinate: cellCoordinate[] = Array.from(
  //   { length: 1 },
  //   (_, i) => randomCoordinate()
  // );

  let headCoordinate: cellCoordinate = randomCoordinate();

  let direction = randomDirection();
  $: oppositeDirection = oppositeDirectionDictionary[direction];
  $: directionVector = directionsProperty[direction].vectorValue;

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
    headCoordinate = mover(headCoordinate, directionVector);
  }, refreshTime);
</script>

<svelte:window on:keydown={handleKeydown} />

<main>
  <div
    class="grid-container"
    style:grid-template-rows={gridRowColumnString}
    style:grid-template-columns={gridRowColumnString}
  >
    <div
      class="cell"
      style:grid-column={`${headCoordinate.x}/${headCoordinate.x + 1}`}
      style:grid-row={`${headCoordinate.y}/${headCoordinate.y + 1}`}
    />

    <!-- {#each arrayOfCoordinate as coordinate}
      <div
        class="cell"
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each} -->
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
