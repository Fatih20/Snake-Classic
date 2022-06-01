<script lang="ts">
  import Header from "./components/Header.svelte";
  import Game from "./components/Game.svelte";
  import Footer from "./components/Footer.svelte";
  import StartPage from "./components/StartPage.svelte";
  import { fade } from "svelte/transition";
  import { gameIsOver, savedGame } from "./stores";
  import { isSavedGameUndefined } from "./utilities/utilities";
  import type { possibleGameStateType } from "./utilities/types";
  import Login from "./components/login.svelte";
  import SignIn from "./components/SignIn.svelte";

  let unique = {};
  let gameState: possibleGameStateType = isSavedGameUndefined($savedGame)
    ? "startPage"
    : "playing";

  function resetCoreGame() {
    unique = {};
    gameIsOver.update((gameIsOver) => false);
  }
</script>

<main>
  {#if gameState === "startPage"}
    <StartPage on:gameStarted={() => (gameState = "playing")} />
  {:else}
    <div class="main-app-container" transition:fade>
      <Header />
      {#if gameState === "playing"}
        {#key unique}
          <Game {resetCoreGame} />
        {/key}
      {/if}
      <div class="spacer" />
      {#if gameState === "login"}
        <Login />
      {:else if gameState === "signIn"}
        <SignIn />
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
