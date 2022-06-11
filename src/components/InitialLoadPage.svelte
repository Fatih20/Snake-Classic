<script lang="ts">
  import { fade } from "svelte/transition";
  import { loadPageTransitionDuration } from "../config";
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

<!-- <main> -->
<main transition:fade={{ duration: loadPageTransitionDuration }}>
  <div class="spinner-container">
    <!-- <i class="fa-solid fa-spinner-third" /> -->
    <i class="fa-solid fa-spinner spinner" />
  </div>
  <h2>The snake is waking up</h2>
</main>

<style>
  main {
    align-items: center;
    background-color: rgb(var(--primary-color));
    color: rgb(var(--text-on-primary-element-color));
    display: flex;
    flex-direction: column;
    gap: 1em;
    height: 100vh;
    justify-content: center;
    width: 100%;
  }

  h2 {
    font-size: 1.2em;
  }

  .spinner-container {
    font-size: 3em;

    /* height: 50px;
    border: solid 1px white; */
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
