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

<main>
  <i class="fa-solid fa-snooze snooze-icon" />
  <h2>The snake refused to wake up</h2>
  <p>Try reloading to wake him up again</p>
</main>

<style>
  main {
    align-items: center;
    background-color: rgb(var(--primary-color));
    color: rgb(var(--text-on-primary-element-color));
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    height: 100vh;
    justify-content: center;
    padding: 2em;
    width: 100%;
  }

  main * {
    color: rgb(var(--text-on-primary-element-color));
  }

  .snooze-icon {
    /* font-size: ; */
  }
</style>
