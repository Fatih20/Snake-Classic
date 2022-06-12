<script lang="ts">
  import { directionsProperty } from "../../utilities/utilities";
  import { deviceWidth, gameIsPaused } from "../../stores";
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
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
    integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
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
        on:click={() => {
          if (!$gameIsPaused) {
            keyDownSimulator(
              directionsProperty[direction].keyList[0].toLowerCase()
            );
          }
        }}
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
    border: solid 1px black;
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
    margin: 0;
    width: 50px;
  }

  .control-button:active {
    background-color: rgb(var(--text-on-primary-element-color));
    color: rgb(var(--primary-color));
  }
</style>
