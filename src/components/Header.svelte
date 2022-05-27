<script lang="ts">
  import { gameIsPaused } from "../stores";
</script>

<head>
  <script
    src="https://kit.fontawesome.com/31a5898fa1.js"
    crossorigin="anonymous"></script>
</head>

<main>
  <div class="width-constrain">
    <!-- <button>Bruh</button> -->
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
  </div>
</main>

<style>
  main {
    --font-size: 1.5em;
    align-items: center;
    background-color: var(--primary-color);
    box-sizing: border-box;
    color: var(--text-on-primary-element-color);
    display: flex;
    /* height: var(--header-height); */
    justify-content: center;
    padding: 0.5em 1em;
    width: 100%;
  }

  main * {
    color: var(--text-on-primary-element-color);
  }

  .width-constrain {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: min(100%, 400px);

    /* border: solid 1px white; */
  }

  .width-constrain > * {
    /* border: solid 1px white; */
  }

  h1 {
    font-size: var(--font-size);
    /* border: solid 1px white; */
  }

  .header-button {
    align-self: center;
    background-color: rgba(0, 0, 0, 0);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    font-size: var(--font-size);
    margin: 0;
    padding: 0;

    /* border: solid 1px white; */
  }

  .icon {
    display: block;
    /* border: solid 1px white; */
  }
</style>
