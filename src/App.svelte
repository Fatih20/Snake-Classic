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
    achievement,
    userData,
    modalOpen,
    initialBindingModalJustOpened,
    bindings,
  } from "./stores";
  import Login from "./components/Login.svelte";
  import { onMount } from "svelte";
  import type { ISavedGameInfo, IUserData } from "./utilities/types";
  import ErrorOnInitialLoad from "./components/ErrorOnInitialLoad.svelte";
  import AccountModal from "./components/AccountModal.svelte";
  import { updateBindings } from "./utilities/api";

  let modalJustError = false;
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
      savedGame.setDataFromServer(retrievedData.savedGame as ISavedGameInfo);
      achievement.setDataFromServer(retrievedData.achievement);
      userData.set(retrievedData.userData as IUserData);
      isLoggedIn.set(true);
    }
    gameState.set("startPage");
  });

  onMount(() => {
    initialBindingModalJustOpened.set($bindings);
  });

  async function handleCloseModal() {
    if (
      JSON.stringify($initialBindingModalJustOpened) !==
      JSON.stringify($bindings)
    ) {
      const response = await updateBindings($bindings);
      if (response.statusCode < 400) {
        modalJustError = false;
        modalOpen.set(false);
        return;
      }
      modalJustError = true;
    } else {
      modalJustError = false;
      modalOpen.set(false);
    }
  }

  async function resetCoreGame() {
    await savedGame.reset($isLoggedIn);
    gameIsOver.set(false);
    gameIsPaused.set(false);
  }

  $: {
    if ($gameState !== "playing") {
      modalOpen.set(false);
    }
  }
</script>

<main>
  {#if $gameState === "loadingData"}
    <InitialLoadPage />
  {:else if $gameState === "startPage"}
    <!-- {#if $gameState === "startPage"} -->
    <StartPage />
  {:else if $gameState === "serverErrorOnInitialLoad"}
    <ErrorOnInitialLoad />
  {:else}
    <div class="main-app-container">
      {#if $modalOpen}
        <div
          class="absolute-container"
          class:absolute-container-visible={$modalOpen}
          on:click={handleCloseModal}
        >
          <AccountModal />
          <div class="spacer" />
          {#if modalJustError}
            <p class="in-overlay-text modal-error-text">
              Error sending your new binding to the server. Please try closing
              the modal again.
            </p>
          {/if}
          <p class="in-overlay-text modal-closing-text">
            Click anywhere but the modal to close it
          </p>
        </div>
      {/if}
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

  .absolute-container {
    align-items: center;
    bottom: 0;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    left: 0;
    opacity: 0;
    right: 0;
    position: absolute;
    padding: 2em;
    top: 0;
    transition: all 0.25s ease-in-out;
    visibility: hidden;
    z-index: 1000;
  }

  .absolute-container-visible {
    /* background-color: rgba(0, 0, 0, 0.5); */
    display: flex;
    opacity: 1;
    pointer-events: all;
    visibility: visible;
  }

  .in-overlay-text {
    border-radius: var(--button-radius);
    display: inline-block;
    user-select: none;
    padding: 0.25em 0.5em;
    text-align: center;
  }

  .modal-closing-text {
    background-color: rgb(var(--primary-color));
    color: rgb(var(--text-on-primary-element-color));
  }

  .modal-error-text {
    background-color: rgb(var(--warning-color-bg));
    color: rgb(var(--text-on-primary-element-color));
  }

  .spacer {
    flex-grow: 1;
  }
</style>
