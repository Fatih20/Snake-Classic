<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function sendGameHasStarted() {
    dispatch("gameStarted");
  }
</script>

<main>
  <h1 id="title">Snake Classics</h1>
  <button on:click={() => sendGameHasStarted()}>Start</button>
</main>

<style>
  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1em;
  }

  #title {
    text-align: center;
    font-size: 4em;
  }
</style>
