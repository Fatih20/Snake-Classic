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
  import {
    gameIsPaused,
    gameIsOver,
    savedWholeSnakeCoordinateList,
    savedDirection,
    savedFruitPositionList,
  } from "../../stores";
  import { fade } from "svelte/transition";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let mainEventLoop: NodeJS.Timer;
  let firstStart: boolean;

  let allCoordinateList = allCoordinateMaker(gridSize);

  let length: number;
  let wholeSnakeCoordinateList: cellCoordinate[];
  let direction: direction;
  let fruitCoordinateList: cellCoordinate[];
  let allFruitEaten: boolean;

  if (
    $savedWholeSnakeCoordinateList === undefined ||
    $savedDirection === undefined ||
    $savedFruitPositionList === undefined
  ) {
    firstStart = true;
    length = initialLength;
    direction = randomDirection();
    wholeSnakeCoordinateList = wholeSnakeCoordinateListInitialGenerator(
      randomCoordinate()
    );
    fruitCoordinateList = randomUniqueCoordinateGenerator(
      wholeSnakeCoordinateList,
      allCoordinateList,
      numberOfFruitSpawned
    );
    allFruitEaten = fruitCoordinateList.length > 0;
  } else {
    firstStart = false;
    gameIsPaused.set(true);
    wholeSnakeCoordinateList = $savedWholeSnakeCoordinateList;
    length = $savedWholeSnakeCoordinateList.length;
    direction = $savedDirection as direction;
    fruitCoordinateList = $savedFruitPositionList;
    allFruitEaten = fruitCoordinateList.length > 0;
  }

  // let direction = randomDirection();
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

  // if (
  //   $savedWholeSnakeCoordinateList === undefined ||
  //   $savedDirection === undefined
  // ) {

  // }

  $: {
    console.log(wholeSnakeCoordinateList);
  }

  let headCoordinate = wholeSnakeCoordinateList[0];
  $: headCoordinate = wholeSnakeCoordinateList[0];
  let cornerOfSnakeBodyList = cornerOfSnakeBodyGenerator(
    wholeSnakeCoordinateList
  );
  $: cornerOfSnakeBodyList = cornerOfSnakeBodyGenerator(
    wholeSnakeCoordinateList
  );

  // $: fruitCoordinateList = fruitCoordinateList.filter((fruitCoordinate) => {
  //   console.log(fruitCoordinate);
  //   console.log(wholeSnakeCoordinateList[0]);
  //   JSON.stringify(fruitCoordinate) !==
  //     JSON.stringify(wholeSnakeCoordinateList[0]);
  // });
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

  $: {
    if ($gameIsOver) {
      savedDirection.reset();
      savedWholeSnakeCoordinateList.reset();
      savedFruitPositionList.reset();
    } else {
      savedDirection.updateAndSave(direction);
      savedWholeSnakeCoordinateList.updateAndSave(wholeSnakeCoordinateList);
      savedFruitPositionList.updateAndSave(fruitCoordinateList);
    }
  }

  let nthTurnReference = 0;

  function wholeSnakeCoordinateListInitialGenerator(
    headCoordinate: cellCoordinate
  ) {
    const oppositeDirectionVector =
      directionsProperty[oppositeDirectionDictionary[direction]].vectorValue;
    let referenceCoordinate = headCoordinate;
    let wholeSnakeCoordinateList: cellCoordinate[] = [headCoordinate];
    for (let i = 1; i < length; i++) {
      referenceCoordinate = wholeSnakeCoordinateList[i - 1];
      wholeSnakeCoordinateList.push(
        mover(referenceCoordinate, oppositeDirectionVector)
      );
    }

    return wholeSnakeCoordinateList;
  }

  function wholeSnakeCoordinateListUpdater(
    wholeSnakeCoordinateList: cellCoordinate[],
    addNewTail: boolean,
    howManyTail: number = 0
  ) {
    const initialHeadCoordinate = wholeSnakeCoordinateList[0];
    const newheadCoordinate = mover(initialHeadCoordinate, directionVector);
    const newBodyCoordinateList = wholeSnakeCoordinateList
      .slice(1)
      .map((coordinate, index) => {
        return wholeSnakeCoordinateList[index];
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
      let lastTail = newBodyCoordinateList[newBodyCoordinateList.length - 1];
      for (let i = 0; i < howManyTail; i++) {
        let newTail = mover(lastTail, directionVectorFromLastTail);
        newTailCoordinateList.push(newTail);
        lastTail = newTailCoordinateList[newTailCoordinateList.length - 1];
      }
    }

    console.log(newheadCoordinate);
    console.log(newBodyCoordinateList);
    console.log(newTailCoordinateList);
    return [
      newheadCoordinate,
      ...newBodyCoordinateList,
      ...newTailCoordinateList,
    ];
  }

  function mover(
    movedCoordinate: cellCoordinate,
    directionVector: directionVectorType
  ): cellCoordinate {
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

  function checkIfHeadBiteBody(wholeSnakeCoordinateList: cellCoordinate[]) {
    const headCoordinate = wholeSnakeCoordinateList[0];
    const bodyCoordinateList = wholeSnakeCoordinateList.slice(1);
    const { x: referenceX, y: referenceY } = headCoordinate;
    let headBiteBody = false;
    bodyCoordinateList.forEach((bodyAndTailCoordinate) => {
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
    // console.log(wholeSnakeCoordinateList);
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

        return `${directionFromNextCoordinate.toLowerCase()}`;
      } else {
        console.log(index);
        const previousCell = wholeSnakeCoordinateList[index - 1];
        const nextCell = wholeSnakeCoordinateList[index + 1];
        const directionFromPreviousCell = positionRelativeTo(
          previousCell,
          snakeCoordinate
        ) as direction;
        const directionFromNextCell = positionRelativeTo(
          nextCell,
          snakeCoordinate
        ) as direction;
        if (
          oppositeDirectionDictionary[directionFromPreviousCell] ===
          directionFromNextCell
        ) {
          console.log(snakeCoordinate);
          console.log(previousCell);
          console.log(nextCell);
          console.log(directionFromNextCell);
          console.log(directionFromPreviousCell);
          return ``;
        } else {
          return `${directionFromPreviousCell.toLowerCase()}-${directionFromNextCell.toLowerCase()}`;
        }
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
    wholeSnakeCoordinateList = wholeSnakeCoordinateListUpdater(
      wholeSnakeCoordinateList,
      justAteFruit,
      numberOfTailAddedAfterEating
    );

    sendLengthData();

    if (allFruitEaten) {
      nthTurnReference += 1;
    }

    if (checkIfHeadBiteBody(wholeSnakeCoordinateList)) {
      gameIsOver.set(true);
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

  $: console.log(cornerOfSnakeBodyList);
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
        class={`fruit ${
          coordinate.x === wholeSnakeCoordinateList[0].x &&
          coordinate.y === wholeSnakeCoordinateList[0].y
            ? "eaten"
            : null
        }`}
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
    {#each wholeSnakeCoordinateList as coordinate, i (`${coordinate.x} ${coordinate.y} ${i}`)}
      <div
        class={`snake-${i === 0 ? `head` : `body`} ${
          cornerOfSnakeBodyList[i]
        }-radius`}
        style:grid-column={`${coordinate.x}/${coordinate.x + 1}`}
        style:grid-row={`${coordinate.y}/${coordinate.y + 1}`}
      />
    {/each}
  </div>
</main>

<style>
  main {
    --overlay-transition-time: 0.25s;
    /* height: 100%; */
    /* flex-grow: 1; */
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
    gap: 1em;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity var(--overlay-transition-time) ease-in-out,
      visibility var(--overlay-transition-time) ease-in-out;
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
    padding: 0.4em;
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
    border: solid 2px rgb(var(--primary-border-color));
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
