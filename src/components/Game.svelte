<script lang="ts">
  import { initialLength, scoresAfterEveryFruit } from "../config";

  import CoreGame from "./gameComponent/CoreGame.svelte";
  import GameInterface from "./gameComponent/GameInterface.svelte";

  let fruitEaten = 0;
  $: score = fruitEaten * scoresAfterEveryFruit;

  let length = initialLength;
</script>

<main>
  <GameInterface {score} {length} />
  <CoreGame
    on:justAteFruit={() => (fruitEaten += 1)}
    on:lengthUpdate={(e) => (length = e.detail.length)}
  />
</main>

<style>
  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
