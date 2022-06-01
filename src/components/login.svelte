<script lang="ts">
  import { placeholderPassword, placeholderUsername } from "../config";

  import { gameState } from "../stores";

  let enteredEmail = "";
  let enteredPassword = "";
  let enteredUsername = "";

  function handleSubmit(e) {}
</script>

<main>
  <h2>{$gameState === "login" ? "Log In" : "Sign In"}</h2>
  <form on:submit={handleSubmit} method="POST">
    <div class="input-element">
      <label for="username-input">Username</label>
      <input
        id="username-input"
        name="username"
        placeholder={placeholderUsername}
        bind:value={enteredUsername}
      />
    </div>
    {#if $gameState === "signIn"}
      <div class="input-element">
        <label for="email-input">Email</label>
        <input
          id="email-input"
          name="email"
          type="email"
          bind:value={enteredEmail}
        />
      </div>
    {/if}
    <div class="input-element">
      <label for="password-input">Password</label>
      <input
        type="password"
        id="password-input"
        name="password"
        placeholder={placeholderPassword}
        bind:value={enteredPassword}
      />
    </div>
  </form>
  <button type="submit">{$gameState === "login" ? "Log In" : "Sign In"}</button>
  {#if $gameState === "login"}
    <p>
      Don't have an account? <span on:click={() => gameState.set("signIn")}
        >Sign in.</span
      >
    </p>
  {:else if $gameState === "signIn"}
    <p>
      Already have an account? <span on:click={() => gameState.set("login")}
        >Log in.</span
      >
    </p>
  {/if}
</main>

<style>
  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  button {
    margin: 0;
  }

  .input-element {
  }

  input {
    width: 100%;
  }
</style>
