<script lang="ts">
  import {
    placeholderEmail,
    placeholderPassword,
    placeholderUsername,
    recallingAPILimit,
    usernameCharacterLimit,
  } from "../config";

  import {
    achievement,
    gameState,
    isLoggedIn,
    savedGame,
    userData,
  } from "../stores";
  import { getSavedGame, login, register } from "../utilities/api";
  import type { ISavedGameInfo } from "../utilities/types";

  let enteredEmail = "";
  let enteredPassword = "";
  let enteredUsername = "";

  $: usernameValid =
    $gameState === "login"
      ? true
      : enteredUsername.length <= usernameCharacterLimit;

  let isLoading = false;
  let showPassword = false;
  let errorOnPreviousAttempt = false;
  let errorMessage: string;

  async function handleSubmit(e) {
    e.preventDefault();

    if ($gameState === "signIn" && !usernameValid) {
      return;
    }

    isLoading = true;
    const response = await ($gameState === "login"
      ? login({ name: enteredUsername, password: enteredPassword })
      : register({
          name: enteredUsername,
          email: enteredEmail,
          password: enteredPassword,
        }));

    if (response.statusCode >= 500) {
      isLoading = false;
      errorOnPreviousAttempt = true;
      errorMessage = "Server error. Try again later.";
      return;
    }

    if (response.statusCode >= 400) {
      isLoading = false;
      errorOnPreviousAttempt = true;
      errorMessage = response.message;
      return;
    }

    isLoggedIn.set(true);
    const {
      retrievedData: {
        achievement: retrievedAchievement,
        savedGame: retrievedSavedGame,
        userData: retrievedUserData,
      },
    } = await getSavedGame();
    savedGame.setDataFromServer(retrievedSavedGame);
    achievement.setDataFromServer(retrievedAchievement);
    userData.set(retrievedUserData);
    isLoading = false;
    gameState.set("playing");
  }

  $: console.log(isLoading);
</script>

<head>
  <script
    src="https://kit.fontawesome.com/31a5898fa1.js"
    crossorigin="anonymous"></script>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
    integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</head>

<main>
  <h2 class="title">
    {$gameState === "login" ? "Log In" : "Sign In"}
  </h2>
  <form on:submit={handleSubmit}>
    <div class="input-element">
      <label for="username-input">Username</label>
      <div class="username-input-container">
        <input
          id="username-input"
          name="username"
          placeholder={placeholderUsername}
          bind:value={enteredUsername}
        />
        {#if $gameState === "signIn"}
          <p
            class="username-warning"
            class:username-not-valid-warning={!usernameValid}
          >
            {enteredUsername.length} / {usernameCharacterLimit}
          </p>
        {/if}
      </div>
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
      <div class="input-element">
        <label for="password-input">Password</label>
        <input
          type="text"
          id="password-input"
          name="password"
          placeholder={placeholderPassword}
          bind:value={enteredPassword}
        />
      </div>
    {:else if $gameState === "login"}
      {#if showPassword}
        <div class="input-element">
          <label for="password-input">Password</label>
          <div class="password-input-container">
            <input
              type="text"
              id="password-input"
              name="password"
              placeholder={placeholderPassword}
              bind:value={enteredPassword}
            />
            <button
              class="toggle-show-password"
              on:click={() => (showPassword = !showPassword)}
            >
              <i class="fa-solid fa-eye" />
            </button>
          </div>
        </div>
      {:else}
        <div class="input-element">
          <label for="password-input">Password</label>
          <div class="password-input-container">
            <input
              type="password"
              id="password-input"
              name="password"
              placeholder={placeholderPassword}
              bind:value={enteredPassword}
            />
            <button
              class="toggle-show-password"
              on:click={() => (showPassword = !showPassword)}
            >
              <i class="fa-solid fa-eye-slash" />
            </button>
          </div>
        </div>
      {/if}
    {/if}
    {#if errorOnPreviousAttempt}
      <div class="error-message-container">
        {errorMessage}
      </div>
    {/if}
    <button
      class="submit-button"
      type="submit"
      class:submit-button-disabled={!usernameValid}
      disabled={!usernameValid}
    >
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

  .username-input-container {
    align-content: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.25em;
    width: 100%;
  }

  .username-input-container input {
    width: 100%;
  }

  .username-warning {
    color: rgb(var(--text-on-white-unintrusive-color));
  }

  .username-not-valid-warning {
    color: rgb(var(--warning-color-bg));
  }

  .password-input-container {
    align-items: center;
    display: flex;
    justify-content: center;
    gap: 0.5em;
    width: 100%;
    /* position: relative; */
  }

  .toggle-show-password {
    align-items: center;
    background-color: rgba(var(--primary-color) 0);
    border: none;
    color: white;
    color: rgb(var(--primary-color));
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    width: 30px;
  }

  input {
    box-sizing: border-box;
    background-color: rgb(var(--primary-color));
    border: solid 2px rgba(var(--primary-color), 0);
    border-radius: var(--button-radius);
    color: rgb(var(--text-on-primary-element-color));
    margin: 0;
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
    border-radius: var(--button-smaller-radius);
    color: rgb(var(--text-on-primary-element-color));
    cursor: pointer;
    font-weight: 600;
    transition: all 0.25s ease-in-out;
    /* font-size: 1em; */
    margin: 0;
    width: 75px;
    padding: 7px;
  }

  .submit-button:hover {
    background-color: rgb(var(--secondary-color));
    color: rgb(var(--text-on-secondary-element-color));
  }

  .submit-button-disabled {
    --border-color: var(--disabled-color);
    background-color: rgb(var(--disabled-color));
    color: rgb(var(--text-on-disabled-element-color));
  }

  .submit-button-disabled:hover {
    background-color: rgb(var(--disabled-color));
    color: rgb(var(--text-on-disabled-element-color));
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
    background-color: rgb(var(--warning-color-bg));
    box-sizing: border-box;
    border-radius: var(--button-radius);
    color: rgb(var(--warning-color-fg));
    padding: 0.25em;
    text-align: center;
    width: 100%;
  }
</style>
