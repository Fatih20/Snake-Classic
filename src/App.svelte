<script lang="ts">
  import Header from "./components/Header.svelte";
  import Game from "./components/Game.svelte";
  import Footer from "./components/Footer.svelte";
  import StartPage from "./components/StartPage.svelte";

  const possibleGameState = ["startPage", "playing", "settings"] as const;
  type possibleGameStateType = typeof possibleGameState[number];

  let unique = {};
  let gameState: possibleGameStateType = "playing";

  function resetCoreGame() {
    unique = {};
  }
</script>

<main>
  {#if gameState === "startPage"}
    <StartPage on:gameStarted={() => (gameState = "playing")} />
  {:else if gameState === "playing"}
    <Header />
    {#key unique}
      <Game {resetCoreGame} />
    {/key}
    <div class="spacer" />
    <Footer />
  {/if}
</main>

<style>
  main {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    position: relative;
  }

  .spacer {
    flex-grow: 1;
  }
</style>
