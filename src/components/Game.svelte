<script lang="ts">
  import { gridSize } from "../config";
  import {
    cellCoordinate,
    makePossibleCoordinate,
    possibleCoordinateType,
  } from "../utilities/types";

  const cellSize = "10px";

  const gridRowColumnString = `repeat(${gridSize}, ${cellSize})`;

  const arrayOfCoordinate: cellCoordinate[] = [
    { x: makePossibleCoordinate(1), y: makePossibleCoordinate(2) },
    { x: makePossibleCoordinate(3), y: makePossibleCoordinate(9) },
    { x: makePossibleCoordinate(4), y: makePossibleCoordinate(5) },
    { x: makePossibleCoordinate(6), y: makePossibleCoordinate(7) },
  ];
</script>

<main>
  <div
    class="grid-container"
    style:grid-template-rows={gridRowColumnString}
    style:grid-template-columns={gridRowColumnString}
  >
    {#each arrayOfCoordinate as coordinate}
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
