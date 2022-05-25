<script lang="ts">
  import Header from "./components/Header.svelte";
  import Game from "./components/Game.svelte";
  import Footer from "./components/Footer.svelte";

  let unique = {};

  function resetCoreGame() {
    unique = {};
  }
</script>

<main>
  <Header />
  {#key unique}
    <Game {resetCoreGame} />
  {/key}
  <div class="spacer" />
  <Footer />
</main>

<style>
  main {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    position: relative;
  }

  .spacer {
    flex-grow: 1;
  }
</style>
