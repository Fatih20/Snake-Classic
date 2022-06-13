<script lang="ts">
  import { loadPageTransitionDuration } from "../config";

  import CoreGame from "./gameComponent/CoreGame.svelte";
  import GameInterface from "./gameComponent/GameInterface.svelte";
  import MobileControl from "./gameComponent/MobileControl.svelte";
  import { fade } from "svelte/transition";

  export let resetCoreGame: () => void;
</script>

<main>
  <CoreGame on:resetGame={resetCoreGame} />
  <GameInterface />
  <!-- <div class="spacer" /> -->
  <MobileControl />
</main>

<style>
  main {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1em;
    /* height: calc(
      100vh - var(--header-height) - var(--footer-height) -
        calc(2 * var(--gap-between-parts))
    ); */
    justify-content: center;
    min-width: 300px;
    padding: 0 1.5em;
    /* width: 100%; */

    /* border: solid 1px black; */
  }

  .spacer {
    flex-grow: 1;
  }
</style>
