<script lang="ts">
  import { achievement, savedGame } from "../../stores";

  let length = $savedGame.wholeSnakeCoordinateList?.length ?? 0;
  $: length = $savedGame.wholeSnakeCoordinateList?.length ?? 0;

  $: highScoreChecker($savedGame.score);
  $: longestLengthChecker(length);

  function highScoreChecker(score: number) {
    if (score >= $achievement.highScore) {
      achievement.updatePartOfAchievement({
        updatedValue: "highScore",
        newValue: score,
      });
    }
  }

  function longestLengthChecker(length: number) {
    if (length >= $achievement.longestLength) {
      achievement.updatePartOfAchievement({
        updatedValue: "longestLength",
        newValue: length,
      });
    }
  }
</script>

<main>
  <div class="attribute-name-container">
    <h2 class="attribute-name">Score</h2>
    <div class="attribute-bar-container" />
    <h2 class="attribute-name">Length</h2>
  </div>
  <div class="attribute-container">
    <div class="attribute-title-container">
      {#if $savedGame.score === $achievement.highScore}
        <h3 class="attribute-title attribute-title-value">
          {$savedGame.score ?? 0}
        </h3>
      {:else}
        <h3 class="attribute-title attribute-title-value">
          {$savedGame.score ?? 0}
        </h3>
        <div class="spacer" />
        <h3
          class={`attribute-title ${
            $savedGame.score !== $achievement.highScore
              ? "attribute-title-top"
              : "attribute-title-value"
          }`}
        >
          {$achievement.highScore}
        </h3>
      {/if}
    </div>
    <div class="attribute-bar-container">
      <div class="title-top-bar" />
      <div
        class="title-bar"
        style={`width : ${($savedGame.score / $achievement.highScore) * 100}%;`}
      />
    </div>
    <div class="attribute-title-container">
      {#if $savedGame.score === $achievement.highScore}
        <h3 class="attribute-title attribute-title-value">
          {length}
        </h3>
      {:else}
        <h3 class="attribute-title attribute-title-value">
          {length}
        </h3>
        <div class="spacer" />
        <h3 class="attribute-title attribute-title-top">
          {$achievement.longestLength}
        </h3>
      {/if}
    </div>
  </div>
</main>

<style>
  main {
    --bar-height: 10px;
    --bar-border-radius: 6px;
    align-items: center;
    display: flex;
    justify-content: center;
    gap: 0.5em;
    width: 100%;
  }

  .attribute-name-container {
    align-items: flex-start;
    border-right: solid 2px rgb(var(--primary-color));
    color: rgb(var(--primary-color));
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 100%;
    padding-right: 0.5em;
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
    justify-content: flex-end;
    width: 100%;

    /* border: solid 1px black; */
  }

  .spacer {
    flex-grow: 1;
  }

  .attribute-title {
    /* border: solid 1px black; */
    display: inline-block;
    max-width: 50%;
  }

  .attribute-title-value {
    color: rgb(var(--primary-color));
  }

  .attribute-title-top {
    color: rgb(var(--secondary-color));
  }

  .attribute-bar-container {
    border-radius: var(--bar-border-radius);
    height: var(--bar-height);
    position: relative;
    width: 100%;
  }

  .title-top-bar {
    background-color: rgb(var(--secondary-color));
    border-radius: var(--bar-border-radius);
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
    border-radius: var(--bar-border-radius);
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
