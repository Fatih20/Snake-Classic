<script lang="ts">
  import {
    highScore,
    savedScore,
    savedFruitEaten,
    savedWholeSnakeCoordinateList,
  } from "../stores";
  import { initialLength, scoresAfterEveryFruit } from "../config";

  import CoreGame from "./gameComponent/CoreGame.svelte";
  import GameInterface from "./gameComponent/GameInterface.svelte";
  import MobileControl from "./gameComponent/MobileControl.svelte";

  export let resetCoreGame: () => void;

  let fruitEaten: number;
  let score: number;
  let length: number;

  if ($savedScore === undefined || $savedFruitEaten === undefined) {
    fruitEaten = 0;
    score = 0;
  } else {
    fruitEaten = $savedFruitEaten;
    score = $savedScore;
  }

  if ($savedWholeSnakeCoordinateList === undefined) {
    length = initialLength;
  } else {
    length = $savedWholeSnakeCoordinateList.length;
  }

  $: {
    savedFruitEaten.updateAndSave(fruitEaten);
    savedScore.updateAndSave(score);
  }

  $: highScoreChecker(score);

  function highScoreChecker(score) {
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
