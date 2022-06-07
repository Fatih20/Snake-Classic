<script lang="ts">
  import {
    placeholderEmail,
    placeholderPassword,
    placeholderUsername,
  } from "../config";

  import { gameState } from "../stores";
  import { login, register } from "../utilities/api";

  let enteredEmail = "";
  let enteredPassword = "";
  let enteredUsername = "";

  let isLoading = false;
  let loginTriedAttempt = 0;
  let errorOnPreviousAttempt = false;
  let errorMessage: string;

  async function handleSubmit(e) {
    loginTriedAttempt += 1;
    e.preventDefault();
    isLoading = true;
    const response = await ($gameState === "login"
      ? login({ name: enteredUsername, password: enteredPassword })
      : register({
          name: enteredUsername,
          email: enteredEmail,
          password: enteredPassword,
        }));

    if (response.statusCode >= 500) {
      if (loginTriedAttempt <= 5) {
        handleSubmit(e);
      } else {
        isLoading = false;
        loginTriedAttempt = 0;
        errorOnPreviousAttempt = true;
        errorMessage = "Server error. Try again later.";
      }
      return;
    }

    if (response.statusCode >= 400) {
      loginTriedAttempt = 0;
      isLoading = false;
      errorOnPreviousAttempt = true;
      errorMessage = response.message;
      return;
    }

    loginTriedAttempt = 0;
    isLoading = false;
  }

  $: console.log(isLoading);
</script>

<main>
  <h2 class="title">
    {$gameState === "login" ? "Log In" : "Sign In"}
  </h2>
  <form on:submit={handleSubmit}>
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
          placeholder={placeholderEmail}
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
    {#if errorOnPreviousAttempt}
      <div class="error-message-container">
        {errorMessage}
      </div>
    {/if}
    <button class="submit-button" type="submit">
      {#if isLoading}
        <i class="fa-solid fa-spinner spinner-button" />
      {:else}
        {$gameState === "login" ? "Log In" : "Sign In"}
      {/if}
    </button>
  </form>
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
    outline: none;
    width: 100%;
  }

  input:focus {
    border: solid 2px rgba(var(--primary-border-color), 1);
  }

  ::placeholder {
    color: rgba(var(--text-on-primary-element-color), 0.75);
  }

  .submit-button {
    background-color: rgb(var(--primary-color));
    border: solid 2px rgba(var(--primary-color), 0);
    border-radius: var(--button-smaller-radius);
    color: rgb(var(--text-on-primary-element-color));
    cursor: pointer;
    font-weight: 600;
    transition: all 0.25s ease-in-out;
    /* font-size: 1em; */
    margin: 0;
    padding: 7px;
  }

  .submit-button:hover {
    background-color: rgb(var(--text-on-primary-element-color));
    border: solid 2px rgba(var(--primary-color), 1);
    color: rgb(var(--primary-color));
  }

  .input-element {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5em;
    padding: 0;
    width: 100%;
  }

  .alternate-text {
    font-weight: 500;
  }

  span {
    cursor: pointer;
  }

  @keyframes spinnerRotation {
    from {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(180deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .spinner-button {
    animation-name: spinnerRotation;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .error-message-container {
    background-color: #ff8c82;
    color: #c6262e;
    padding: 0.5em;
    text-align: center;
    width: 100%;
  }
</style>
