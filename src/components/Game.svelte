<script lang="ts">
  import { scoresAfterEveryFruit } from "../config";

  import CoreGame from "./gameComponent/CoreGame.svelte";
  import GameInterface from "./gameComponent/GameInterface.svelte";

  let fruitEaten = 0;
  $: score = fruitEaten * scoresAfterEveryFruit;
</script>

<main>
  <GameInterface {score} />
  <CoreGame on:justAteFruit={() => (fruitEaten += 1)} />
</main>

<style>
  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
