<script lang="ts">
  import { gameState, isLoggedIn } from "../stores";

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
  <button on:click={handleLogButton}
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
    justify-content: flex-start;
    padding: 0.5em;
    width: 100%;
  }
</style>
