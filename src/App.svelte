<script lang="ts">
  import Header from "./components/Header.svelte";
  import Game from "./components/Game.svelte";
  import Footer from "./components/Footer.svelte";
  import StartPage from "./components/StartPage.svelte";
  import InitialLoadPage from "./components/InitialLoadPage.svelte";
  import { fade } from "svelte/transition";
  import {
    gameIsOver,
    savedGame,
    gameState,
    gameIsPaused,
    isLoggedIn,
    highScore,
  } from "./stores";
  import Login from "./components/Login.svelte";
  import { onMount } from "svelte";
  import type { ISavedGameInfo } from "./utilities/types";

  onMount(async () => {
    console.log(new Date().getMilliseconds());
    const response = await savedGame.getServerData();
    console.log(response);
    const { statusCode, retrievedData } = response;
    console.log(new Date().getMilliseconds());
    if (statusCode >= 500) {
      gameState.set("serverErrorOnInitialLoad");
      return;
    }

    if (statusCode < 400) {
      console.log(retrievedData);
      savedGame.setDataFromServer(
        JSON.parse(retrievedData.savedGame) as ISavedGameInfo
      );
      highScore.setDataFromServer(retrievedData.highScore);
      isLoggedIn.set(true);
    }
    gameState.set("startPage");
  });
  function resetCoreGame() {
    savedGame.reset();
    gameIsOver.set(false);
    gameIsPaused.set(false);
  }
</script>

<main>
  {#if $gameState === "loadingData"}
    <InitialLoadPage />
  {:else if $gameState === "startPage"}
    <!-- {#if $gameState === "startPage"} -->
    <StartPage />
  {:else}
    <div class="main-app-container" transition:fade>
      <Header on:resetGame={resetCoreGame} />
      {#if $gameState === "playing"}
        <Game {resetCoreGame} />
      {/if}
      {#if $gameState === "login" || $gameState === "signIn"}
        <div class="spacer" />
        <Login />
        <!-- <div class="spacer" /> -->
        <div class="spacer" />
      {/if}
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
