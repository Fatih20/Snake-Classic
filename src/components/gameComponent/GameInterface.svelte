<script lang="ts">
  export let score: number;
  export let length: number;
  export let highScore: number;
</script>

<main>
  <div class="attribute-box">
    <h2>Score</h2>
    <h3>{score}</h3>
  </div>
  <div class="attribute-box">
    <h2>Length</h2>
    <h3>{length}</h3>
  </div>
  <div class="attribute-box">
    <h2>High Score</h2>
    <h3>{highScore}</h3>
  </div>
</main>

<style>
  main {
    align-items: center;
    display: flex;
    justify-content: center;
    /* gap: 1em; */
  }

  .attribute-box {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    justify-content: center;
    padding: 0 0.5em;
  }

  .attribute-box:first-child {
    border-right: solid 2px black;
  }

  .attribute-box:last-child {
    border-left: solid 2px black;
  }

  h2 {
    font-size: 1.2em;
  }

  h3 {
    font-size: 1.5em;
  }

  @media (min-width: 600px) {
    h2 {
      font-size: 1.2em;
    }

    h3 {
      font-size: 1.5em;
    }
  }
</style>
