<script lang="ts">
  import Header from "./components/Header.svelte";
  import Game from "./components/Game.svelte";
  import Footer from "./components/Footer.svelte";
  import StartPage from "./components/StartPage.svelte";
  import { fade } from "svelte/transition";
  import { gameIsOver, savedGame, gameState } from "./stores";
  import { isSavedGameUndefined } from "./utilities/utilities";
  import Login from "./components/login.svelte";

  let unique = {};
  if (isSavedGameUndefined($savedGame)) {
  }

  if (!isSavedGameUndefined($savedGame)) {
    gameState.set("playing");
  }

  function resetCoreGame() {
    unique = {};
    gameIsOver.update((gameIsOver) => false);
  }
</script>

<main>
  {#if $gameState === "startPage"}
    <StartPage on:gameStarted={() => gameState.set("playing")} />
  {:else}
    <div class="main-app-container" transition:fade>
      <Header />
      {#if $gameState === "playing"}
        {#key unique}
          <Game {resetCoreGame} />
        {/key}
      {/if}
      <div class="spacer" />
      {#if $gameState === "login" || $gameState === "signIn"}
        <Login />
        <!-- <div class="spacer" /> -->
      {/if}
      <div class="spacer" />
      <Footer />
    </div>
  {/if}
</main>

<style>
  main {
    --header-height: 50px;
    --footer-height: 50px;
    --gap-between-parts: 1em;
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--gap-between-parts);
    justify-content: center;
    height: 100vh;
    width: 100%;
    /* border: solid 1px white; */
  }

  .main-app-container {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--gap-between-parts);
    justify-content: center;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .spacer {
    flex-grow: 1;
  }
</style>
