<script lang="ts">
  import {
    bindings,
    deviceWidth,
    gameState,
    isLoggedIn,
    userData,
  } from "../stores";

  import { logout } from "../utilities/api";

  async function handleLogout() {
    const response = await logout();

    if (response.statusCode < 400) {
      // isLoggedIn.set(false);
      window.location.reload();
    }
    return;
  }

  async function handleLogButton() {
    if ($isLoggedIn) {
      await handleLogout();
    } else {
      gameState.set("login");
    }
  }
</script>

<main on:click={(e) => e.stopPropagation()}>
  <h2 class="title">Enjoy the game, {$userData.username}!</h2>
  {#if $deviceWidth >= 1000}
    <div class="key-binding-container">
      <h3 class="section-title">Key Binding</h3>
      <div class="key-button-container">
        {#each Object.keys($bindings) as direction (direction)}
          <button
            class={`control-button`}
            id={direction.toLowerCase()}
            on:click={() => {}}
          >
            {$bindings[direction][0].toUpperCase()}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  <button class="log-button" on:click={handleLogButton}
    >{$isLoggedIn ? "Log Out" : "Log In"}</button
  >
</main>

<style>
  main {
    align-items: center;
    background-color: rgb(var(--primary-color));
    border-radius: var(--button-radius);
    box-sizing: border-box;
    /* border: solid 2px white; */
    color: rgb(var(--text-on-primary-element-color));
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: flex-start;
    padding: 0.5em;
    width: 100%;
    max-width: 300px;
  }

  .title {
    display: inline-block;
    padding-bottom: 0.25em;
    font-size: 1.5em;
    font-weight: 600;
    text-align: center;
    border-bottom: solid 2px rgb(var(--text-on-primary-element-color));
  }

  .log-button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    color: rgb(var(--text-on-primary-element-color));
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }

  .key-binding-container {
    padding-bottom: 0.25em;
    border-bottom: solid 2px rgb(var(--text-on-primary-element-color));
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .key-button-container {
    display: grid;
    column-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    row-gap: 10px;
    /* width: 100%; */
    /* border: solid 1px black; */
  }

  .section-title {
    align-self: flex-start;
    font-size: 1em;
  }

  #up {
    grid-column: 2/3;
    grid-row: 1/2;
  }

  #down {
    grid-column: 2/3;
    grid-row: 2/3;
  }

  #right {
    grid-column: 3/4;
    grid-row: 2/3;
  }

  #left {
    grid-column: 1/2;
    grid-row: 2/3;
  }
</style>
