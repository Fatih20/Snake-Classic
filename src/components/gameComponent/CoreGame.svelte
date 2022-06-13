<script lang="ts">
  import Saving from "./Saving.svelte";
  import {
    delayUntilGameStarts,
    gridSize,
    numberOfFruitSpawned,
    numberOfTailAddedAfterEating,
    refreshTimeDecrementEveryTurn,
    refreshTimeLowerBound,
    refreshTimeMultiplierEveryTurn,
    saveInterval,
    scoresAfterEveryFruit,
    turnIntervalBetweenFruitSpawn,
  } from "../../config";
  import {
    oppositeDirectionDictionary,
    allCoordinateList,
    directionToVectorDict,
  } from "../../utilities/utilities";
  import {
    gameIsPaused,
    gameIsOver,
    savedGame,
    firstStart,
    savedGameStale,
    achievementStale,
    achievement,
    isLoggedIn,
    bindings,
  } from "../../stores";

  import { createEventDispatcher, onMount } from "svelte";

  import {
    checkIfHeadBiteBody,
    cornerOfSnakeBodyGenerator,
    keyToDirectionConverter,
    randomUniqueCoordinateGenerator,
    wholeSnakeCoordinateListUpdater,
  } from "../../utilities/utilitiesCoreGame";
  import { updateAchievement, updateSavedGame } from "../../utilities/api";

  let mainEventLoop: NodeJS.Timer;
  let dispatch = createEventDispatcher();
  let allFruitEaten = $savedGame.fruitPositionList.length === 0;

  let candidateDirection = $savedGame.direction;
  let previousDirection = $savedGame.direction;
  let oppositeDirection = oppositeDirectionDictionary[$savedGame.direction];
  let directionVector = directionToVectorDict[$savedGame.direction];
  let oppositeDirectionVector = directionToVectorDict[oppositeDirection];

  $: oppositeDirection = oppositeDirectionDictionary[$savedGame.direction];
  $: oppositePreviousDirection = oppositeDirectionDictionary[previousDirection];
  $: directionVector = directionToVectorDict[$savedGame.direction];
  $: oppositeDirectionVector = directionToVectorDict[oppositeDirection];

  let headCoordinate = $savedGame.wholeSnakeCoordinateList[0];
  $: headCoordinate = $savedGame.wholeSnakeCoordinateList[0];

  let cornerOfSnakeBodyList = cornerOfSnakeBodyGenerator(
    $savedGame.wholeSnakeCoordinateList
  );
  $: cornerOfSnakeBodyList = cornerOfSnakeBodyGenerator(
    $savedGame.wholeSnakeCoordinateList
  );

  let nthTurnReference = 0;

  let isSaving = false;
  let attemptToSaveCompleted = true;
  let errorWhenSaving = false;

  function sendResetGame() {
    dispatch("resetGame");
  }

  function handleKeydown(e) {
    const { key: keyPressed } = e;
    const candidateDirection = keyToDirectionConverter(keyPressed, $bindings);
    if (candidateDirection === null) {
      return;
    }

    if (candidateDirection !== oppositePreviousDirection) {
      savedGame.updatePartOfSavedGame(
        {
          updatedValue: "direction",
          newValue: candidateDirection,
        },
        $isLoggedIn
      );
    }
  }

  onMount(() => {
    console.log($savedGame.currentRefreshTime, "Current refresh time");
  });

  function toBeRunInMainEventLoop() {
    savedGame.updatePartOfSavedGame(
      {
        updatedValue: "currentRefreshTime",
        newValue:
          $savedGame.currentRefreshTime >= refreshTimeLowerBound
            ? $savedGame.currentRefreshTime * refreshTimeMultiplierEveryTurn
            : $savedGame.currentRefreshTime,
      },
      $isLoggedIn
    );
    previousDirection = $savedGame.direction;
    let justAteFruit = false;
    $savedGame.fruitPositionList.forEach((fruitCoordinate, indexOuter) => {
      if (JSON.stringify(fruitCoordinate) === JSON.stringify(headCoordinate)) {
        justAteFruit = true;
        savedGame.updatePartOfSavedGame(
          {
            updatedValue: "fruitEaten",
            newValue: $savedGame.fruitEaten + 1,
          },
          $isLoggedIn
        );
        savedGame.updatePartOfSavedGame(
          {
            updatedValue: "score",
            newValue: $savedGame.score + scoresAfterEveryFruit,
          },
          $isLoggedIn
        );
        savedGame.updatePartOfSavedGame(
          {
            updatedValue: "fruitPositionList",
            newValue: $savedGame.fruitPositionList.filter(
              (fruitCoordinate, indexInner) => {
                return indexInner !== indexOuter;
              }
            ),
          },
          $isLoggedIn
        );
      }
    });
    savedGame.updatePartOfSavedGame(
      {
        updatedValue: "wholeSnakeCoordinateList",
        newValue: wholeSnakeCoordinateListUpdater(
          $savedGame.wholeSnakeCoordinateList,
          directionVector,
          justAteFruit ? numberOfTailAddedAfterEating : 0
        ),
      },
      $isLoggedIn
    );

    savedGameStale.set(true);

    if (allFruitEaten) {
      nthTurnReference += 1;
    }

    if (checkIfHeadBiteBody($savedGame.wholeSnakeCoordinateList)) {
      gameIsOver.set(true);
    }

    if ($gameIsOver) {
      gameIsPaused.set(true);
      if (!$isLoggedIn) {
        savedGame.removeFromLocalStorage();
      }
    }

    startTimeout();

    // console.log("Game is running");
  }

  function startTimeout() {
    mainEventLoop = setTimeout(
      toBeRunInMainEventLoop,
      $savedGame.currentRefreshTime
    );
  }

  function gameFlowControl(resumeOrStart: boolean) {
    if (resumeOrStart) {
      startTimeout();
    } else {
      clearTimeout(mainEventLoop);
    }
  }

  if ($isLoggedIn) {
    setInterval(savingToTheServer, saveInterval);
  }

  async function savingToTheServer() {
    if (isSaving) {
      return;
    }

    attemptToSaveCompleted = false;
    errorWhenSaving = false;

    function revertIsSaving() {
      setTimeout(() => {
        isSaving = false;
      }, 500);
    }

    if ($savedGameStale) {
      isSaving = true;
      savedGameStale.set(false);
      const response = await updateSavedGame($savedGame);
      attemptToSaveCompleted = true;
      revertIsSaving();
      if (response.statusCode >= 400) {
        savedGameStale.set(true);
        errorWhenSaving = true;
        return;
      }
    }

    if ($achievementStale) {
      isSaving = true;
      achievementStale.set(false);
      const response = await updateAchievement($achievement);
      attemptToSaveCompleted = true;
      revertIsSaving();
      if (response.statusCode >= 400) {
        achievementStale.set(true);
        errorWhenSaving = true;
        return;
      }
    }
  }

  $: {
    if ($firstStart) {
      setTimeout(() => {
        gameFlowControl(!$gameIsPaused);
      }, delayUntilGameStarts);
      firstStart.set(false);
    } else {
      gameFlowControl(!$gameIsPaused);
    }
  }

  $: allFruitEaten = $savedGame.fruitPositionList.length === 0;
  $: {
    if (allFruitEaten && nthTurnReference === turnIntervalBetweenFruitSpawn) {
      savedGame.updatePartOfSavedGame(
        {
          updatedValue: "fruitPositionList",
          newValue: randomUniqueCoordinateGenerator(
            $savedGame.wholeSnakeCoordinateList,
            allCoordinateList,
            numberOfFruitSpawned
          ),
        },
        $isLoggedIn
      );
      nthTurnReference = 0;
      allFruitEaten = false;
    }
  }

  $: {
    if ($savedGame.currentRefreshTime < 1) {
      gameIsOver.set(true);
    }
  }

  // $: console.log(cornerOfSnakeBodyList);
</script>

<svelte:window on:keydown={handleKeydown} />

<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Asap:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</head>

<main>
  <div class="spacer" />
  <div
    class="grid-container"
    class:grid-container-bordered={!$gameIsOver && !$gameIsPaused}
    style={`--gridSize : ${gridSize};`}
  >
    <div
      class="overlay-container game-is-paused-container"
      class:shown={$gameIsPaused}
    >
      <h2>Game is Paused</h2>
      <button
        id="restart-button"
        on:click={() => {
          sendResetGame();
          // gameIsPaused.set(false);
        }}>New Game</button
      >
    </div>
    <div
      class="overlay-container game-over-container"
      class:shown={$gameIsOver}
    >
      <h2>Game Over!</h2>
      <button id="restart-button" on:click={sendResetGame}>Play Again</button>
    </div>
    {#each $savedGame.fruitPositionList as coordinate (`${coordinate.x} ${coordinate.y}`)}
      <div
        class={`fruit ${
          coordinate.x === $savedGame.wholeSnakeCoordinateList[0].x &&
          coordinate.y === $savedGame.wholeSnakeCoordinateList[0].y
            ? "eaten"
            : null
        }`}
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
    {#each $savedGame.wholeSnakeCoordinateList as coordinate, i (`${coordinate.x} ${coordinate.y} ${i}`)}
      <div
        class={`snake-${i === 0 ? `head` : `body`} ${
          cornerOfSnakeBodyList[i]
        }-radius`}
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
  </div>
  <Saving {attemptToSaveCompleted} {isSaving} {errorWhenSaving} />
  <div class="spacer" />
</main>

<style>
  main {
    --overlay-transition-time: 0.25s;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* height: 100%; */
    flex-grow: 1;
    position: relative;
    width: 100%;

    /* border: solid 1px black; */
  }

  .overlay-container {
    align-items: center;
    background-color: rgba(var(--primary-color));
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity var(--overlay-transition-time) ease-in-out,
      visibility var(--overlay-transition-time) ease-in-out;
    user-select: none;
    visibility: hidden;
  }

  .game-over-container {
    z-index: 1000;
  }

  .game-is-paused-container {
    z-index: 100;
  }

  .overlay-container h2 {
    /* background-color: #000000; */
    border-radius: 10px;
    color: rgb(var(--text-on-primary-element-color));
    /* color: yellow; */
    display: inline-block;
    font-size: 3em;
    font-family: "Pacifico", cursive;
    font-weight: 400;
    /* padding: 0.4em; */
    text-align: center;
  }

  .shown {
    /* display: flex; */
    opacity: 1;
    visibility: visible;
  }
  #restart-button {
    border: none;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    color: rgb(var(--text-on-primary-element-color));
    font-family: "Asap", sans-serif;
    font-size: 1.75em;
    font-weight: 700;
    padding: 0;
  }

  .grid-container {
    aspect-ratio: 1 / 1;
    box-sizing: border-box;
    border: none;
    display: grid;
    gap: 0;
    grid-template-columns: repeat(var(--gridSize), 1fr);
    grid-template-rows: repeat(var(--gridSize), 1fr);
    margin: 0 auto;
    /* max-height: 100%; */
    /* max-width: 100%; */
    padding: 0;
    position: relative;
    transition: border var(--overlay-transition-time) ease-in-out;
    width: 100%;
  }

  .grid-container-bordered {
    border: solid 2px rgb(var(--primary-border-color));
  }

  .spacer {
    flex-grow: 1;
  }

  .snake-body,
  .snake-head {
    background-color: rgb(var(--snake-color));
    border: none;
  }

  .snake-head {
    --border-radius: var(--head-border-radius);
  }

  .snake-body {
    --border-radius: var(--snake-border-radius);
  }

  .fruit {
    background-color: rgb(var(--fruit-color));
    border-radius: var(--fruit-border-radius);
    border: none;
  }

  .eaten {
    display: none;
  }

  .up-radius {
    border-top-right-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
  }

  .left-radius {
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }

  .right-radius {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }

  .down-radius {
    border-bottom-right-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
  }

  .up-right-radius,
  .right-up-radius {
    border-top-right-radius: var(--border-radius);
  }

  .up-left-radius,
  .left-up-radius {
    border-top-left-radius: var(--border-radius);
  }

  .right-down-radius,
  .down-right-radius {
    border-bottom-right-radius: var(--border-radius);
  }

  .left-down-radius,
  .down-left-radius {
    border-bottom-left-radius: var(--border-radius);
  }
</style>
