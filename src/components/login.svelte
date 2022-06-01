<script lang="ts">
  import { placeholderPassword, placeholderUsername } from "../config";

  import { gameState } from "../stores";

  let enteredEmail = "";
  let enteredPassword = "";
  let enteredUsername = "";

  function handleSubmit(e) {}
</script>

<main>
  <h2 class="title">
    {$gameState === "login" ? "Log In" : "Sign In"}
  </h2>
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
  <button class="submit-button" type="submit"
    >{$gameState === "login" ? "Log In" : "Sign In"}</button
  >
  <p class="alternate-text">
    {#if $gameState === "login"}
      Don't have an account? <span on:click={() => gameState.set("signIn")}
        >Sign in.</span
      >
    {:else if $gameState === "signIn"}
      Already have an account? <span on:click={() => gameState.set("login")}
        >Log in.</span
      >
    {/if}
  </p>
</main>

<style>
  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1em;
  }

  .title,
  label,
  span {
    color: rgb(var(--primary-color));
  }

  form {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5em;
  }

  label {
    font-weight: 500;
  }

  input {
    box-sizing: border-box;
    background-color: rgb(var(--primary-color));
    border: solid 2px rgba(var(--primary-color), 0);
    border-radius: var(--button-radius);
    color: rgb(var(--text-on-primary-element-color));
    outline-color: rgb(var(--text-on-primary-element-color));
    outline-style: solid;
    outline-width: 2px;
    width: 100%;
  }

  input:focus {
    background-color: rgb(var(--text-on-primary-element-color));
    border: solid 2px rgb(var(--primary-color));
    color: rgb(var(--primary-color));
  }

  ::placeholder {
    color: rgba(var(--text-on-primary-element-color), 0.75);
  }

  .submit-button {
    background-color: rgb(var(--primary-color));
    border: none;
    border-radius: var(--button-smaller-radius);
    color: rgb(var(--text-on-primary-element-color));
    font-weight: 600;
    margin: 0;
  }

  .input-element {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5em;
  }

  .alternate-text {
    font-weight: 500;
  }

  span {
    cursor: pointer;
  }
</style>
