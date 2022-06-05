<script lang="ts">
  import { highScore, savedGame } from "../stores";
  import { initialLength, scoresAfterEveryFruit } from "../config";

  import CoreGame from "./gameComponent/CoreGame.svelte";
  import GameInterface from "./gameComponent/GameInterface.svelte";
  import MobileControl from "./gameComponent/MobileControl.svelte";
  import { isSavedGameUndefined } from "../utilities/utilities";

  export let resetCoreGame: () => void;

  let fruitEaten: number;
  let score: number;
  let length: number;
</script>

<main>
  <GameInterface />
  <CoreGame on:resetGame={resetCoreGame} />
  <!-- <div class="spacer" /> -->
  <MobileControl />
</main>

<style>
  main {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1em;
    /* height: calc(
      100vh - var(--header-height) - var(--footer-height) -
        calc(2 * var(--gap-between-parts))
    ); */
    justify-content: center;
    flex-grow: 1;
    padding: 0 1.5em;
    /* width: 100%; */

    /* border: solid 1px black; */
  }

  .spacer {
    flex-grow: 1;
  }
</style>
