<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import {
    mainMenuTransitionDuration,
    loadPageTransitionDuration,
  } from "../config";
  import { firstStart, gameState, isLoggedIn } from "../stores";

  const dispatch = createEventDispatcher();

  // function sendGameHasStarted() {
  //   dispatch("gameStarted");
  // }
</script>

<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Asap:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</head>

<main
  in:fade={{ duration: loadPageTransitionDuration }}
  out:fade={{ duration: mainMenuTransitionDuration }}
>
  <div id="content-container">
    <h1 id="title">Snake<br />Classic</h1>
    <!-- <div class="spacer" /> -->
    <div id="button-container">
      <button
        class="option-container"
        on:click={() => {
          gameState.set("playing");
        }}
      >
        <h3 class="start-button-title">Play as a Guest</h3>
        <p>Save your game and high score on this device</p>
      </button>
      {#if !$isLoggedIn}
        <button
          class="option-container"
          on:click={() => {
            gameState.set("login");
          }}
        >
          <h3 class="start-button-title">Login</h3>
          <p>
            Save your game and high score to your account (or create new one!)
          </p>
        </button>
      {:else}
        <button
          class="option-container"
          on:click={() => {
            gameState.set("playing");
          }}
        >
          <h3 class="start-button-title">Play as username</h3>
          <p>Your save game and high score will be saved to this account</p>
        </button>
      {/if}
    </div>
  </div>
</main>

<style>
  main {
    align-items: center;
    background-color: rgb(var(--primary-color));
    bottom: 0;
    color: rgb(var(--text-on-primary-element-color));
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    left: 0;
    width: 100%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
  }

  main * {
    color: rgb(var(--text-on-primary-element-color));
  }

  #content-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5em;
    height: 300px;
    /* border: solid 1px white; */
  }

  #button-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1.5em;

    /* border: solid 1px white; */
  }

  #button-container button {
    margin: 0;
    padding: 0;
  }

  .option-container {
    align-items: center;
    background-color: rgb(var(--primary-color));
    /* border: solid 2px black; */
    border: none;
    /* box-sizing: border-box; */
    border-radius: var(--button-radius);
    /* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4); */
    cursor: pointer;
    font-family: "Asap", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: center;
    max-width: 200px;
    text-align: center;
  }

  #title {
    font-family: "Pacifico", cursive;
    text-align: center;
    font-size: 4em;
    font-weight: 400;
    line-height: 1.25em;
  }

  .spacer {
    flex-grow: 1;
  }

  .start-button-title {
    font-size: 1.75em;
    font-weight: 700;
    transition: all 0.1s ease-in-out;
    width: 100%;
  }

  /* .start-button:hover {
    background-color: rgb(var(--secondary-color));
    color: rgb(var(--text-on-secondary-selected-element-color));
    font-size: 2em;
  } */

  .clicked {
    background-color: rgb(var(--secondary-active-color)) !important;
    color: rgb(var(--text-on-secondary-active-element-color)) !important;
    transition: all 0.25s ease-in-out !important;
  }
</style>
