<script lang="ts">
  import { directionsProperty } from "../../utilities/utilities";
  function keyDownSimulator(key: string) {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: key,
      })
    );
  }
</script>

<head>
  <script
    src="https://kit.fontawesome.com/31a5898fa1.js"
    crossorigin="anonymous"></script>
</head>

<main>
  {#each Object.keys(directionsProperty) as direction (direction)}
    <button
      class="control-button"
      id={direction.toLowerCase()}
      on:click={() =>
        keyDownSimulator(directionsProperty[direction].key.toLowerCase())}
    >
      <i class={`fa-solid fa-arrow-${direction.toLowerCase()}`} />
    </button>
  {/each}
  <!-- <button class="control-button" id="up" on:click={() => keyDownSimulator("w")}>
    <i class="fa-solid fa-arrow-up" />
  </button>
  <button
    class="control-button"
    id="down"
    on:click={() => keyDownSimulator("s")}
  >
    <i class="fa-solid fa-arrow-down" />
  </button>
  <button
    class="control-button"
    id="right"
    on:click={() => keyDownSimulator("d")}
  >
    <i class="fa-solid fa-arrow-right" />
  </button>
  <button
    class="control-button"
    id="left"
    on:click={() => keyDownSimulator("a")}
  >
    <i class="fa-solid fa-arrow-left" />
  </button> -->
</main>

<style>
  main {
    display: grid;
    column-gap: 10px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    row-gap: 10px;
    width: 100%;
  }

  #up {
    grid-column: 2/3;
    grid-row: 1/2;
  }

  #down {
    grid-column: 2/3;
    grid-row: 2/3;
  }

  #right {
    grid-column: 3/4;
    grid-row: 2/3;
  }

  #left {
    grid-column: 1/2;
    grid-row: 2/3;
  }

  .control-button {
    aspect-ratio: 1/1;
  }
</style>
