<script lang="ts">
  import { fade } from "svelte/transition";

  export let isSaving: boolean;
  export let attemptToSaveCompleted: boolean;
  export let errorWhenSaving: boolean;
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

<main class:gapless-main={!isSaving} class:error={errorWhenSaving}>
  {#if isSaving}
    {#if !attemptToSaveCompleted}
      <i class="fa-solid fa-spinner spinner" />
      <p in:fade>Saving</p>
    {:else}
      <p out:fade>
        {errorWhenSaving ? "Failed to save" : "Game saved successfully"}
      </p>
    {/if}
  {:else}
    <p in:fade />
  {/if}
</main>

<style>
  main {
    align-items: center;
    display: flex;
    gap: 0.5em;
    height: 20px;
    justify-content: center;
    padding: 0.5em;
  }

  main * {
    color: rgb(var(--text-on-white-unintrusive-color));
  }

  .error * {
    color: rgb(var(--warning-color-fg));
  }

  .gapless-main {
    gap: 0;
  }

  p {
    padding: 0;
    margin: 0;
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

  .spinner {
    animation-name: spinnerRotation;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
</style>
