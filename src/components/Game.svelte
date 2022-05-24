<script lang="ts">
  import { gridSize } from "../config";
  import { cellCoordinate, makePossibleCoordinate } from "../utilities/types";

  const cellSize = "10px";

  const gridRowColumnString = `repeat(${gridSize}, ${cellSize})`;

  const oneCoordinate: cellCoordinate = [
    makePossibleCoordinate(1),
    makePossibleCoordinate(1),
  ];
</script>

<main>
  <div
    class="grid-container"
    style:grid-template-rows={gridRowColumnString}
    style:grid-template-columns={gridRowColumnString}
  >
    <div class="mock-item first" />
    <div class="mock-item second" />
    <div class="mock-item third" />
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

  .mock-item {
    background-color: yellow;
    border: solid 1px black;
  }

  .first {
    grid-column: 1/2;
    grid-row: 2/3;
  }

  .second {
    grid-row: 1/2;
    grid-column: 3/4;
  }

  .third {
    grid-column: 9/10;
    grid-row: 3/4;
  }
</style>
