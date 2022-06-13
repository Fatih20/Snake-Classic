<script lang="ts">
  import type { SavingText } from "../../utilities/types";
  import { fade } from "svelte/transition";

  export let isSaving: boolean;
  export let text: SavingText = "Saving";
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
  {#if isSaving}
    {#if text === "Saving"}
      <i class="fa-solid fa-spinner spinner" />
      <p in:fade>{text}</p>
    {:else}
      <p out:fade>{text}</p>
    {/if}
  {:else}
    <p />
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
