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

  if (isSavedGameUndefined($savedGame)) {
    fruitEaten = 0;
    score = 0;
  } else {
    fruitEaten = $savedGame.fruitEaten;
    score = $savedGame.score;
  }

  if (isSavedGameUndefined($savedGame)) {
    length = initialLength;
  } else {
    length = $savedGame.wholeSnakeCoordinateList.length;
  }

  $: {
    savedGame.updateFruitEaten(fruitEaten);
    savedGame.updateScore(score);
  }

  $: highScoreChecker(score);

  function highScoreChecker(score: number) {
    if (score > $highScore) {
      highScore.updateAndSave(score);
    }
  }
</script>

<main>
  <GameInterface {score} {length} highScore={$highScore} />
  <CoreGame
    on:justAteFruit={() => {
      fruitEaten += 1;
      score += scoresAfterEveryFruit;
    }}
    on:lengthUpdate={(e) => (length = e.detail.length)}
    on:resetGame={resetCoreGame}
  />
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
