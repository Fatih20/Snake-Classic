<script lang="ts">
  import { gameIsPaused } from "../stores";
</script>

<head>
  <script
    src="https://kit.fontawesome.com/31a5898fa1.js"
    crossorigin="anonymous"></script>
</head>

<main>
  <button
    on:click={() =>
      gameIsPaused.update((gameIsPaused) => (gameIsPaused = !gameIsPaused))}
    class="header-button"
  >
    {#if $gameIsPaused}
      <i class="fa-solid fa-play icon" />
    {:else}
      <i class="fa-solid fa-pause icon" />
    {/if}
  </button>
  <h1>Snake Classics</h1>
  <button class="header-button">
    <i class="fa-solid fa-right-to-bracket icon" />
  </button>
</main>

<style>
  main {
    --font-size: 1.5em;
    align-items: center;
    background-color: #206b00;
    box-sizing: border-box;
    color: white;
    display: flex;
    /* height: var(--header-height); */
    justify-content: space-between;
    padding: 0.5em 1em;
    width: 100%;
  }

  h1 {
    font-size: var(--font-size);
    /* border: solid 1px white; */
  }

  .header-button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    color: white;
    display: flex;
    font-size: var(--font-size);
    padding: 0;

    /* border: solid 1px white; */
  }

  .icon {
    /* border: solid 1px white; */
  }
</style>
