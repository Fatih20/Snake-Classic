<script lang="ts">
  import {
    delayUntilGameStarts,
    gridSize,
    initialLength,
    mainMenuTransitionDuration,
    numberOfFruitSpawned,
    numberOfTailAddedAfterEating,
    refreshTime,
    turnIntervalBetweenFruitSpawn,
  } from "../../config";
  import {
    cellCoordinate,
    direction,
    directionVectorType,
    edgeCoordinateCornerType,
    makePossibleCoordinate,
    possibleCoordinateType,
    possibleDirection,
  } from "../../utilities/types";
  import {
    randomCoordinate,
    randomDirection,
    directionsProperty,
    oppositeDirectionDictionary,
    allCoordinateMaker,
    randomUniqueCoordinateGenerator,
    positionRelativeTo,
  } from "../../utilities/utilities";
  import { gameIsPaused, gameIsOver } from "../../stores";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let firstStart = true;

  let mainEventLoop: NodeJS.Timer;

  let allCoordinateList = allCoordinateMaker(gridSize);
  let direction = randomDirection();
  let candidateDirection = direction;
  let previousDirection = direction;
  let oppositeDirection = oppositeDirectionDictionary[direction];
  let directionVector = directionsProperty[direction].vectorValue;
  let oppositeDirectionVector =
    directionsProperty[oppositeDirection].vectorValue;

  $: oppositeDirection = oppositeDirectionDictionary[direction];
  $: oppositePreviousDirection = oppositeDirectionDictionary[previousDirection];
  $: directionVector = directionsProperty[direction].vectorValue;
  $: oppositeDirectionVector =
    directionsProperty[oppositeDirection].vectorValue;

  let headCoordinate: cellCoordinate = randomCoordinate();
  let length = initialLength;
  let bodyAndTailCoordinateList =
    bodyAndTailCoordinateInitialGenerator(headCoordinate);
  let wholeSnakeCoordinateList = [headCoordinate, ...bodyAndTailCoordinateList];
  $: wholeSnakeCoordinateList = [headCoordinate, ...bodyAndTailCoordinateList];
  // let cornerOfSnakeBodyList = cornerOfSnakeBodyGenerator(
  //   wholeSnakeCoordinateList
  // );
  // $: cornerOfSnakeBodyList = cornerOfSnakeBodyGenerator(
  //   wholeSnakeCoordinateList
  // );

  let allFruitEaten = false;
  let fruitCoordinateList = randomUniqueCoordinateGenerator(
    wholeSnakeCoordinateList,
    allCoordinateList,
    numberOfFruitSpawned
  );
  $: allFruitEaten = fruitCoordinateList.length === 0;
  $: {
    if (allFruitEaten && nthTurnReference === turnIntervalBetweenFruitSpawn) {
      fruitCoordinateList = randomUniqueCoordinateGenerator(
        wholeSnakeCoordinateList,
        allCoordinateList,
        numberOfFruitSpawned
      );
      nthTurnReference = 0;
      allFruitEaten = false;
    }
  }

  let nthTurnReference = 0;

  const directionsToCornerEdgeDictionary: Record<
    direction,
    edgeCoordinateCornerType
  > = {
    Up: "above-radius",
    Down: "bottom-radius",
    Right: "right-radius",
    Left: "left-radius",
  };

  function bodyAndTailCoordinateInitialGenerator(
    headCoordinate: cellCoordinate
  ) {
    let bodyAndTailCoordinateList: cellCoordinate[] = [];
    let referenceCoordinate = headCoordinate;
    for (let i = 0; i < length; i++) {
      if (i !== 0) {
        referenceCoordinate = bodyAndTailCoordinateList[i - 1];
      }

      bodyAndTailCoordinateList.push(
        mover(referenceCoordinate, oppositeDirectionVector)
      );
    }

    return bodyAndTailCoordinateList;
  }

  function bodyAndTailCoordinateUpdater(
    wholeSnakeCoordinateList: cellCoordinate[],
    addNewTail: boolean,
    howManyTail: number = 0
  ) {
    let newBodyAndTailCoordinateList = wholeSnakeCoordinateList
      .slice(1)
      .map((coordinate, index) => {
        if (index === 0) {
          return headCoordinate;
        } else {
          return bodyAndTailCoordinateList[index - 1];
        }
      });

    let newTailCoordinateList = [] as cellCoordinate[];
    if (addNewTail) {
      length += 1;
      const tailDirection = positionRelativeTo(
        wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 2],
        wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 1]
      );
      const directionVectorFromLastTail =
        directionsProperty[tailDirection].vectorValue;
      let lastTail =
        newBodyAndTailCoordinateList[newBodyAndTailCoordinateList.length - 1];
      for (let i = 0; i < howManyTail; i++) {
        let newTail = mover(lastTail, directionVectorFromLastTail);
        newTailCoordinateList.push(newTail);
        lastTail = newTailCoordinateList[newTailCoordinateList.length - 1];
      }
    }

    return [...newBodyAndTailCoordinateList, ...newTailCoordinateList];
  }

  function mover(
    movedCoordinate: cellCoordinate,
    directionVector: directionVectorType
  ) {
    let newX: number;
    let newY: number;
    const { x: incrementX, y: incrementY } = directionVector;
    if (movedCoordinate.x + incrementX > gridSize) {
      newX = 1;
    } else if (movedCoordinate.x + incrementX < 1) {
      newX = gridSize;
    } else {
      newX = movedCoordinate.x + incrementX;
    }

    if (movedCoordinate.y + incrementY > gridSize) {
      newY = 1;
    } else if (movedCoordinate.y + incrementY < 1) {
      newY = gridSize;
    } else {
      newY = movedCoordinate.y + incrementY;
    }

    return { x: makePossibleCoordinate(newX), y: makePossibleCoordinate(newY) };
  }

  function handleKeydown(e) {
    // console.log(direction);
    const { key } = e;
    const keyPressed = key.toUpperCase();
    Object.values(directionsProperty).forEach(({ key }, index) => {
      if (keyPressed === key) {
        candidateDirection = possibleDirection[index];
      }
    });
    if (candidateDirection !== oppositePreviousDirection) {
      direction = candidateDirection;
    }
  }

  function checkIfHeadBiteBody(
    headCoordinate: cellCoordinate,
    bodyAndTailCoordinateList: cellCoordinate[]
  ) {
    const { x: referenceX, y: referenceY } = headCoordinate;
    let headBiteBody = false;
    bodyAndTailCoordinateList.forEach((bodyAndTailCoordinate) => {
      const { x: comparedX, y: comparedY } = bodyAndTailCoordinate;
      if (referenceX === comparedX && referenceY === comparedY) {
        headBiteBody = true;
        // console.log("You lost");
      }
    });
    return headBiteBody;
  }

  function cornerOfSnakeBodyGenerator(
    wholeSnakeCoordinateList: cellCoordinate[]
  ) {
    return wholeSnakeCoordinateList.map((snakeCoordinate, index) => {
      if (index === 0 || index === wholeSnakeCoordinateList.length - 1) {
        const comparedCell =
          index === 0
            ? wholeSnakeCoordinateList[1]
            : wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 2];
        const directionFromNextCoordinate = positionRelativeTo(
          comparedCell,
          snakeCoordinate
        );

        return `${directionFromNextCoordinate.toLowerCase()}-radius`;
      } else {
        const comparedCellOne = wholeSnakeCoordinateList[index - 1];
        const comparedCellTwo = wholeSnakeCoordinateList[index + 1];
        return ``;
      }
    });
  }

  function sendFruitEatenData() {
    dispatch("justAteFruit");
  }

  function sendLengthData() {
    dispatch("lengthUpdate", {
      length: length,
    });
  }

  function sendResetGame() {
    dispatch("resetGame");
  }

  function toBeRunInMainEventLoop() {
    previousDirection = direction;
    let justAteFruit = false;
    fruitCoordinateList.forEach((fruitCoordinate, indexOuter) => {
      if (JSON.stringify(fruitCoordinate) === JSON.stringify(headCoordinate)) {
        justAteFruit = true;
        sendFruitEatenData();
        fruitCoordinateList = fruitCoordinateList.filter(
          (fruitCoordinate, indexInner) => {
            return indexInner !== indexOuter;
          }
        );
      }
    });
    bodyAndTailCoordinateList = bodyAndTailCoordinateUpdater(
      wholeSnakeCoordinateList,
      justAteFruit,
      numberOfTailAddedAfterEating
    );
    headCoordinate = mover(headCoordinate, directionVector);

    sendLengthData();

    if (allFruitEaten) {
      nthTurnReference += 1;
    }

    if (checkIfHeadBiteBody(headCoordinate, bodyAndTailCoordinateList)) {
      gameIsOver.update((gameIsOver) => true);
    }

    if ($gameIsOver) {
      gameFlowControl(false);
    }

    // console.log("Game is running");
  }

  function gameFlowControl(resumeOrStart: boolean) {
    if (resumeOrStart) {
      mainEventLoop = setInterval(toBeRunInMainEventLoop, refreshTime);
    } else {
      clearInterval(mainEventLoop);
    }
  }

  $: {
    if (firstStart) {
      setTimeout(() => {
        gameFlowControl(!$gameIsPaused);
      }, delayUntilGameStarts);
      firstStart = false;
    } else {
      gameFlowControl(!$gameIsPaused);
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
  <div
    class="overlay-container game-is-paused-container"
    class:shown={$gameIsPaused}
  >
    <h2>Game is Paused</h2>
  </div>
  <div class="overlay-container game-over-container" class:shown={$gameIsOver}>
    <h2>Game Over!</h2>
    <button id="restart-button" on:click={() => sendResetGame()}
      >Play Again</button
    >
  </div>
  <div class="grid-container" style={`--gridSize : ${gridSize};`}>
    {#each fruitCoordinateList as coordinate (`${coordinate.x} ${coordinate.y}`)}
      <div
        class="fruit standalone-object"
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
    {#each wholeSnakeCoordinateList as coordinate, i (`${coordinate.x} ${coordinate.y} ${i}`)}
      <div
        class={`snake-body`}
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
  </div>
</main>

<style>
  main {
    /* height: 100%; */
    /* flex-grow: 1; */
    position: relative;
    width: 100%;

    /* border: solid 1px black; */
  }

  .overlay-container {
    align-items: center;
    background-color: var(--primary-color);
    bottom: 0;
    display: none;
    flex-direction: column;
    gap: 1em;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
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
    color: var(--text-on-primary-element-color);
    display: inline-block;
    font-size: 3em;
    font-family: "Pacifico", cursive;
    font-weight: 400;
    padding: 0.4em;
    text-align: center;
  }

  .shown {
    display: flex;
  }
  #restart-button {
    border: none;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    color: var(--text-on-primary-element-color);
    font-family: "Asap", sans-serif;
    font-size: 1.75em;
    font-weight: 700;
    padding: 0;
  }

  .grid-container {
    aspect-ratio: 1 / 1;
    box-sizing: border-box;
    border: solid 1px black;
    display: grid;
    gap: 0;
    grid-template-columns: repeat(var(--gridSize), 1fr);
    grid-template-rows: repeat(var(--gridSize), 1fr);
    margin: 0 auto;
    /* max-height: 100%; */
    /* max-width: 100%; */
    padding: 0;
    width: 100%;
  }

  .snake-body,
  .snake-head {
    background-color: var(--snake-color);
  }

  .fruit {
    background-color: var(--fruit-color);
  }

  .standalone-object {
    border-radius: var(--object-border-radius);
  }

  .up-radius {
    border-top-right-radius: var(--object-border-radius);
    border-top-left-radius: var(--object-border-radius);
  }

  .left-radius {
    border-top-left-radius: var(--object-border-radius);
    border-bottom-left-radius: var(--object-border-radius);
  }

  .right-radius {
    border-top-right-radius: var(--object-border-radius);
    border-bottom-right-radius: var(--object-border-radius);
  }

  .down-radius {
    border-bottom-right-radius: var(--object-border-radius);
    border-bottom-left-radius: var(--object-border-radius);
  }
</style>
