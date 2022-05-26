<script lang="ts">
  import { highScore } from "../stores";
  import { initialLength, scoresAfterEveryFruit } from "../config";

  import CoreGame from "./gameComponent/CoreGame.svelte";
  import GameInterface from "./gameComponent/GameInterface.svelte";
  import MobileControl from "./gameComponent/MobileControl.svelte";

  export let resetCoreGame: () => void;

  let fruitEaten = 0;
  $: score = fruitEaten * scoresAfterEveryFruit;
  $: highScoreChecker(score);

  let length = initialLength;

  function highScoreChecker(score) {
    if (score > $highScore) {
      highScore.updateAndSave(score);
    }
  }
</script>

<main>
  <GameInterface {score} {length} highScore={$highScore} />
  <CoreGame
    on:justAteFruit={() => (fruitEaten += 1)}
    on:lengthUpdate={(e) => (length = e.detail.length)}
    on:resetGame={resetCoreGame}
  />
  <div class="spacer" />
  <MobileControl />
</main>

<style>
  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1em;
    flex-grow: 1;
  }

  .spacer {
    flex-grow: 1;
  }
</style>
