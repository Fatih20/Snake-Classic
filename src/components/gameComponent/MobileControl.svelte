<script lang="ts">
  import { directionsProperty } from "../../utilities/utilities";
  import { deviceWidth } from "../../stores";
  function keyDownSimulator(key: string) {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: key,
      })
    );
  }

  //   $: console.log($deviceWidth);
</script>

<head>
  <script
    src="https://kit.fontawesome.com/31a5898fa1.js"
    crossorigin="anonymous"></script>
</head>

<main>
  {#if $deviceWidth <= 1000}
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
  {/if}
</main>

<style>
  main {
    display: grid;
    column-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    row-gap: 10px;
    /* width: 100%; */
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
    background-color: rgb(var(--primary-color));
    border: none;
    border-radius: 10px;
    color: rgb(var(--text-on-primary-element-color));
    font-size: 1.25em;
    width: 50px;
  }

  .control-button:active {
    background-color: rgb(var(--text-on-primary-element-color));
    color: rgb(var(--primary-color));
  }
</style>
