<script lang="ts">
  import Header from "./components/Header.svelte";
  import Game from "./components/Game.svelte";
  import Footer from "./components/Footer.svelte";

  let gameIsRunning = true;
  let unique = {};

  function resetCoreGame() {
    unique = {};
  }

  $: {
    console.log(gameIsRunning);
  }
</script>

<main>
  <!-- <div class="absolute-container" class:shown={!gameIsRunning}>
    <div class="game-over-container">
      <h2>Game Over!</h2>
      <button
        on:click={() => {
          gameIsRunning = true;
          unique = {};
        }}>Play Again</button
      >
    </div>
  </div> -->
  <Header />
  {#key unique}
    <Game {resetCoreGame} />
  {/key}
  <div class="spacer" />
  <Footer />
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

  .absolute-container {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    bottom: 0;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
  }

  .shown {
    display: flex;
  }

  .game-over-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .spacer {
    flex-grow: 1;
  }
</style>
