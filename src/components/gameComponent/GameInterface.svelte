<script lang="ts">
  import { initialLength } from "../../config";
  import { highScore, savedGame } from "../../stores";

  $: highScoreChecker($savedGame.score);

  function highScoreChecker(score: number) {
    if (score >= $highScore) {
      highScore.updateAndSave(score);
    }
  }
</script>

<main>
  <div class="attribute-container">
    <div class="attribute-title-container">
      <h2 class="attribute-title attribute-title-value">Score</h2>
      <div class="spacer" />
      <h2
        class={`attribute-title ${
          $savedGame.score !== $highScore
            ? "attribute-title-top"
            : "attribute-title-value"
        }`}
      >
        High Score
      </h2>
    </div>
    <div class="attribute-bar-container">
      <div class="title-top-bar" />
      <div
        class="title-bar"
        style={`width : ${($savedGame.score / $highScore) * 100}%;`}
      />
    </div>
    <div class="attribute-title-container">
      {#if $savedGame.score === $highScore}
        <h3 class="attribute-title attribute-title-value">
          {$savedGame.score ?? 0}
        </h3>
      {:else}
        <h3 class="attribute-title attribute-title-value">
          {$savedGame.score ?? 0}
        </h3>
        <div class="spacer" />
        <h3 class="attribute-title attribute-title-top">{$highScore}</h3>
      {/if}
    </div>
  </div>
  <!-- <div class="attribute-box">
    <h2>Score</h2>
    <h3>{$savedGame.score ?? 0}</h3>
  </div>
  <div class="attribute-box">
    <h2>High Score</h2>
    <h3>{$highScore}</h3>
  </div>
  <div class="attribute-box">
    <h2>Length</h2>
    <h3>{$savedGame.wholeSnakeCoordinateList?.length ?? initialLength}</h3>
  </div> -->
</main>

<style>
  main {
    --bar-height: 20px;
    align-items: center;
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    /* gap: 1em; */
    width: 100%;
  }

  .attribute-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    justify-content: center;
    width: 100%;
  }

  .attribute-title-container {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;

    /* border: solid 1px black; */
  }

  .spacer {
    flex-grow: 1;
  }

  .attribute-title-value {
    display: inline-block;
    max-width: 50%;
  }

  .attribute-title {
    color: rgb(var(--primary-color));
  }

  .attribute-title-top {
    color: rgb(var(--secondary-color));
  }

  .attribute-bar-container {
    height: var(--bar-height);
    position: relative;
    width: 100%;
  }

  .title-top-bar {
    background-color: rgb(var(--secondary-color));
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 1;
  }

  .title-bar {
    background-color: rgb(var(--primary-color));
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0;
    transition: width 0.25s ease-in-out;
    z-index: 2;
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
